"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDevDropDatabase = exports.appRedirect = void 0;
const public_queries_db_1 = require("./public-queries.db");
const underscore_1 = __importDefault(require("underscore"));
function sendDescriptiveRedirect(res, result) {
    const location = underscore_1.default.unescape(result.location);
    res.redirect(302, location);
    res.end();
}
function sendRedirect(res, result) {
    const location = underscore_1.default.unescape(result.location);
    res.redirect(302, location);
    res.end();
}
function sendErrorResponse(res, error) {
    res.status(400).send(error.message);
}
function appRedirect(req, res) {
    const isDecriptiveUrl = /.*?@.*?/.test(req.params.redirectUrl);
    if (isDecriptiveUrl) {
        const [userTag, descriptionTag] = req.params.redirectUrl.split('@');
        (0, public_queries_db_1.getShortlink)({
            userTag,
            descriptionTag
        }).then((result) => {
            if (!result)
                throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`);
            return sendDescriptiveRedirect(res, result);
        }).catch((err) => {
            return sendErrorResponse(res, err);
        });
    }
    else {
        const hash = req.params.redirectUrl;
        (0, public_queries_db_1.getShortlink)({
            hash
        }).then((result) => {
            if (!result)
                throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`);
            return sendRedirect(res, result);
        }).catch((err) => {
            return sendErrorResponse(res, err);
        });
    }
}
exports.appRedirect = appRedirect;
function appDevDropDatabase(req, res) {
    (0, public_queries_db_1.__wipeDB)()
        .then((result) => {
        res.json(result);
    })
        .catch((err) => {
        res.status(400).json(err);
    });
}
exports.appDevDropDatabase = appDevDropDatabase;
//# sourceMappingURL=app.controllers.js.map