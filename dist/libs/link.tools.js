"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("underscore"));
const config_1 = __importDefault(require("../config"));
class LinkTools {
    baseUrl;
    displayServiceUrl;
    constructor() {
        this.baseUrl = config_1.default.serviceUrl;
        this.displayServiceUrl = config_1.default.displayServiceUrl;
    }
    validateURL(str) {
        try {
            new URL(str);
            return true;
        }
        catch {
            return false;
        }
    }
    sanitizeURLSlug(str) {
        str = str.replace(/[^a-z0-9\s-]/ig, '');
        str = str.replace(/\s/ig, '-');
        return str;
    }
    generateShortlinkFromHash(hash) {
        return `${this.baseUrl}/${hash}`;
    }
    generateDescriptiveShortlink({ userTag, descriptionTag }) {
        const userTagPart = userTag ? userTag : '';
        const descriptionTagPart = '@' + descriptionTag;
        return `${this.baseUrl}/${userTagPart}${descriptionTagPart}`;
    }
    fixUrl(url) {
        let result = url.trim();
        if (result.indexOf('?') == -1)
            result = result.replace(/\/$/, '');
        if (this.validateURL(url))
            return result;
        result = 'https://' + result;
        if (this.validateURL(result))
            return result;
        throw new Error(`URL ${result} is not valid`);
    }
    queryUrlSearchParams(queryParam, searchParamsString) {
        if (!searchParamsString)
            return Array.from({ length: _.size(queryParam) }, () => null);
        const searchParams = new URLSearchParams(searchParamsString);
        let result = [];
        _.forEach(queryParam, (param) => {
            result.push(searchParams.get(param));
        });
        _.map(result, (item) => {
            if (item != null)
                return decodeURIComponent(item);
        });
        return result;
    }
    makeDisplayUrl(rawUrl) {
        let result = (rawUrl || '').trim().replace(/^https?:\/\//ig, '');
        result = result.replace(/^www\./ig, '');
        return result;
    }
}
exports.default = new LinkTools();
//# sourceMappingURL=link.tools.js.map