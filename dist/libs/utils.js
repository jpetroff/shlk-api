"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cliColors = exports.prepareURL = exports.clearURLTracking = exports.sanitizeMongo = void 0;
const underscore_1 = __importDefault(require("underscore"));
function sanitizeMongo(dirtyData) {
    if (dirtyData instanceof Object) {
        for (const key in dirtyData) {
            if (/^\$/.test(key)) {
                delete dirtyData[key];
            }
            else {
                sanitizeMongo(dirtyData[key]);
            }
        }
    }
    else if (underscore_1.default.isString(dirtyData)) {
        dirtyData = dirtyData.replace(/[${}]/ig, '');
    }
    return dirtyData;
}
exports.sanitizeMongo = sanitizeMongo;
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
function prepareURL(_url) {
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
exports.prepareURL = prepareURL;
exports.cliColors = {
    red: `\x1b[1;31m`,
    green: `\x1b[1;32m`,
    yellow: `\x1b[1;33m`,
    end: `\x1b[0m`,
};
//# sourceMappingURL=utils.js.map