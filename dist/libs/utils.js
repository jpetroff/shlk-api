"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtError = exports.sameOrNoOwnerID = exports.allEmpty = exports.cliColors = exports.normalizeURL = exports.clearURLTracking = void 0;
const underscore_1 = __importDefault(require("underscore"));
function clearURLTracking(url) {
    const trackingParams = [
        'fbclid',
        'utm_source', 'utm_medium', 'utm_content', 'utm_campaign', 'utm_term',
        '_ga', 'dclid', 'gclid', 'msclkid', 'sessionid'
    ];
    trackingParams.forEach((param) => url.searchParams.delete(param));
    return url;
}
exports.clearURLTracking = clearURLTracking;
function normalizeURL(_url) {
    let url = _url.trim();
    const protocolRegex = new RegExp('^https?://');
    if (!protocolRegex.test(url))
        url = 'https://' + url;
    const URLObj = new URL(url);
    let URLString = clearURLTracking(URLObj).toString();
    if (URLString.indexOf('?') == -1)
        URLString = URLString.replace(/\/$/, '');
    return URLString;
}
exports.normalizeURL = normalizeURL;
exports.cliColors = {
    red: `\x1b[1;31m`,
    green: `\x1b[1;32m`,
    yellow: `\x1b[1;33m`,
    end: `\x1b[0m`,
};
function allEmpty(...args) {
    if (arguments.length == 0)
        return false;
    if (arguments.length == 1)
        return !arguments[0];
    return underscore_1.default.reduce(arguments, (prev, curr) => {
        return (!prev) && (!curr);
    });
}
exports.allEmpty = allEmpty;
function sameOrNoOwnerID(_id1, _id2) {
    const id1 = _id1 ? _id1.toString() : _id1;
    const id2 = _id2 ? _id2.toString() : _id2;
    return allEmpty(id1, id2) || id1 == id2;
}
exports.sameOrNoOwnerID = sameOrNoOwnerID;
class ExtError extends Error {
    constructor(message, meta) {
        super(message);
        this.name = 'Error';
        Error.captureStackTrace(this, this.constructor);
        this.meta = meta;
    }
}
exports.ExtError = ExtError;
//# sourceMappingURL=utils.js.map