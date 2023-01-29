"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticRoute = exports.appRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app_controllers_1 = require("./app.controllers");
const appRouter = express_1.default.Router();
exports.appRouter = appRouter;
const publicDir = process.env.NODE_ENV == 'production' ?
    path_1.default.join(__dirname, '../public') :
    path_1.default.join(__dirname, '../../../shlk-app/dist');
const indexPath = path_1.default.join(publicDir, 'index.html');
appRouter.get(['/', '/app/*'], (req, res) => { res.sendFile(indexPath); });
appRouter.get('/:redirectUrl', app_controllers_1.appRedirect);
appRouter.get('/rest/w', app_controllers_1.appDevDropDatabase);
appRouter.get('/rest/ping', (req, res) => { res.sendStatus(200); });
const staticRoute = express_1.default.static(publicDir);
exports.staticRoute = staticRoute;
//# sourceMappingURL=app.routes.js.map