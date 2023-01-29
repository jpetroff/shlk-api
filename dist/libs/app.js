"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_router_1 = require("./app-router");
const oauth_router_1 = require("./oauth-router");
const qraphql_yoga_1 = __importDefault(require("./qraphql-yoga"));
const helmet_1 = __importDefault(require("helmet"));
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
        this.express.use(app_router_1.staticRoute);
        this.express.use('/api', qraphql_yoga_1.default);
        this.express.use('/', app_router_1.appRouter);
        this.express.use('/', oauth_router_1.oauthRouter);
    }
    start(port) {
        this.express.listen(port);
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map