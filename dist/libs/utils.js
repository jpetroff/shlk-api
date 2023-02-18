"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readableBytes = exports.ExtError = exports.sameOrNoOwnerID = exports.allEmpty = exports.cliColors = exports.normalizeURL = exports.clearURLTracking = void 0;
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
    meta;
    constructor(message, meta) {
        super(message);
        this.name = 'Error';
        Error.captureStackTrace(this, this.constructor);
        this.meta = meta;
    }
}
exports.ExtError = ExtError;
var BASE;
(function (BASE) {
    BASE[BASE["TWO"] = 2] = "TWO";
    BASE[BASE["TEN"] = 10] = "TEN";
})(BASE || (BASE = {}));
const UNITS = {
    [BASE.TEN]: ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
    [BASE.TWO]: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
};
function toFixed(value, n) {
    const m = Math.pow(10, n);
    return Math.round(value * m) / m;
}
function parseBytes(value, base = BASE.TEN) {
    const bytes = Number(value);
    const absValue = Math.abs(bytes);
    const step = base === BASE.TWO
        ? 1024
        : 1000;
    if (!Number.isFinite(absValue)) {
        throw new TypeError("value can not be used as a finite number");
    }
    let i;
    if (absValue === 0)
        i = 0;
    else {
        i =
            base === BASE.TWO
                ? Math.floor(Math.log2(absValue) / 10)
                : Math.floor(Math.log10(absValue) / 3);
    }
    const j = Math.min(i, UNITS[base].length - 1);
    const v = toFixed(absValue / Math.pow(step, j), 2);
    return {
        value: absValue === 0 ? 0 : v * (value / absValue),
        unit: UNITS[base][j],
    };
}
function readableBytes(bytes, base = BASE.TWO) {
    const { value, unit } = parseBytes(bytes, base);
    return `${value} ${unit}`;
}
exports.readableBytes = readableBytes;
//# sourceMappingURL=utils.js.map