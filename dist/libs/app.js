"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_routes_1 = require("./app.routes");
const oauth_routes_1 = require("./oauth.routes");
const qraphql_yoga_1 = __importDefault(require("./qraphql-yoga"));
const helmet_1 = __importDefault(require("helmet"));
const utils_1 = require("./utils");
const express_session_1 = __importDefault(require("express-session"));
const config_1 = __importDefault(require("../config"));
const helmetOpts = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "script-src": [`'self'`],
            "style-src": [`'self'`, `*`],
            "img-src": [`'self'`, `*`],
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
};
class App {
    express;
    constructor() {
        this.express = (0, express_1.default)();
        this.express.use(app_routes_1.staticRoute);
    }
    mountRoutes() {
        this.express.use('/api', qraphql_yoga_1.default);
        this.express.use('/', oauth_routes_1.oauthRouter);
        this.express.use('/', app_routes_1.appRouter);
        return this;
    }
    useHelmet() {
        this.express.use((0, helmet_1.default)(helmetOpts));
        return this;
    }
    useSessionStorage(store) {
        const _store = (0, express_session_1.default)({
            secret: config_1.default.APP_SESSION_SECRET,
            name: 'sid',
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30 * 6,
                httpOnly: false,
                secure: false
            },
            store: store,
            resave: true,
            saveUninitialized: false
        });
        this.express.use(_store);
        return this;
    }
    start(port) {
        this.express.listen(port, () => console.log(`${utils_1.cliColors.green}[✓]${utils_1.cliColors.end} Server listening on port ${port}`));
        return this;
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map