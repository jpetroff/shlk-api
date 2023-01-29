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
const helmetOpts = {
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "script-src": ["'self'", "http://localhost:35729"],
            "style-src": null,
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
};
class App {
    constructor() {
        this.express = (0, express_1.default)();
        this.mountRoutes();
    }
    mountRoutes() {
        if (process.env.NODE_ENV != 'development') {
            this.express.use((0, helmet_1.default)(helmetOpts));
        }
        this.express.use(app_routes_1.staticRoute);
        this.express.use('/api', qraphql_yoga_1.default);
        this.express.use('/', app_routes_1.appRouter);
        this.express.use('/', oauth_routes_1.oauthRouter);
    }
    start(port) {
        this.express.listen(port, () => console.log(`${utils_1.cliColors.green}[✓]${utils_1.cliColors.end} Server listening on port ${port}`));
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map