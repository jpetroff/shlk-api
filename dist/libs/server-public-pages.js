"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendRedirect = exports.sendDescriptiveRedirect = void 0;
const underscore_1 = __importDefault(require("underscore"));
function sendDescriptiveRedirect(res, result) {
    const location = underscore_1.default.unescape(result.location);
    res.redirect(302, location);
    res.end();
}
exports.sendDescriptiveRedirect = sendDescriptiveRedirect;
function sendRedirect(res, result) {
    const location = underscore_1.default.unescape(result.location);
    res.redirect(302, location);
    res.end();
}
exports.sendRedirect = sendRedirect;
function sendErrorResponse(res, error) {
    res.status(400).send(error.message);
}
exports.sendErrorResponse = sendErrorResponse;
//# sourceMappingURL=server-public-pages.js.map