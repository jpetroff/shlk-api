"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticRoute = exports.appRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const public_queries_db_1 = require("./public-queries.db");
const server_public_pages_1 = require("./server-public-pages");
const utils_1 = require("./utils");
const appRouter = express_1.default.Router();
exports.appRouter = appRouter;
const publicDir = process.env.NODE_ENV == 'production' ?
    path_1.default.join(__dirname, '../public') :
    path_1.default.join(__dirname, '../../../shlk-app/dist');
appRouter.get(['/', '/app/*'], (req, res) => {
    res.sendFile(path_1.default.join(publicDir, 'index.html'));
});
appRouter.get('/:redirectUrl', (req, res) => {
    const isDecriptiveUrl = /.*?@.*?/.test(req.params.redirectUrl);
    if (isDecriptiveUrl) {
        const [userTag, descriptionTag] = req.params.redirectUrl.split('@');
        (0, public_queries_db_1.getShortlink)({
            userTag: (0, utils_1.sanitizeMongo)(userTag),
            descriptionTag: (0, utils_1.sanitizeMongo)(descriptionTag)
        }).then((result) => {
            if (!result)
                throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`);
            return (0, server_public_pages_1.sendDescriptiveRedirect)(res, result);
        }).catch((err) => {
            return (0, server_public_pages_1.sendErrorResponse)(res, err);
        });
    }
    else {
        const hash = (0, utils_1.sanitizeMongo)(req.params.redirectUrl);
        (0, public_queries_db_1.getShortlink)({
            hash
        }).then((result) => {
            if (!result)
                throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`);
            return (0, server_public_pages_1.sendRedirect)(res, result);
        }).catch((err) => {
            return (0, server_public_pages_1.sendErrorResponse)(res, err);
        });
    }
});
appRouter.get('/rest/w', (req, res) => {
    (0, public_queries_db_1.__wipeDB)()
        .then((result) => {
        res.json(result);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
});
appRouter.get('/rest/ping', (req, res) => {
    res.sendStatus(200);
});
const staticRoute = express_1.default.static(publicDir);
exports.staticRoute = staticRoute;
//# sourceMappingURL=app.routes.js.map