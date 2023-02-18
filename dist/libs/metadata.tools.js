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
const link_tools_1 = __importDefault(require("./link.tools"));
const utils_1 = require("./utils");
class MetadataTools {
    constructor() { }
    getDefaultFavicon(list) {
        if (!list || list.length < 1) {
            return null;
        }
        return list[0];
    }
    sortFaviconList(list) {
        if (!list || list.length < 1) {
            return null;
        }
        let faviconList = _.map(list, (item) => {
            if (!item.sizes || item.sizes == 'any') {
                item.sizes = '-1';
                return item;
            }
            const sizeArray = item.sizes?.split('x');
            item.sizes = sizeArray[0] || '-1';
            return item;
        });
        faviconList = _.sortBy(faviconList, (item) => { return parseInt(item.sizes || '-1'); });
        return faviconList;
    }
    getTitle(shortlink) {
        if (!shortlink.urlMetadata)
            return link_tools_1.default.makeDisplayUrl(shortlink.location);
        return shortlink.urlMetadata.title ||
            shortlink.urlMetadata.og?.title ||
            shortlink.urlMetadata.site_name ||
            shortlink.urlMetadata.og?.site_name ||
            link_tools_1.default.makeDisplayUrl(shortlink.location);
    }
    getDescription(shortlink) {
        if (!shortlink.urlMetadata)
            return '';
        const type = shortlink.urlMetadata.type.replace(/;.*$/ig, '').trim();
        if (/html/ig.test(type)) {
            const v = (shortlink.urlMetadata.description ||
                shortlink.urlMetadata.og?.description ||
                '');
            return v.trim() || '';
        }
        if (/image/ig.test(type)) {
            let strings = ['Image'];
            if (shortlink.urlMetadata.size)
                strings.push((0, utils_1.readableBytes)(parseInt(shortlink.urlMetadata.size)));
            return strings.join(' · ');
        }
        if (/video/ig.test(type)) {
            let strings = ['Video'];
            if (shortlink.urlMetadata.size)
                strings.push((0, utils_1.readableBytes)(parseInt(shortlink.urlMetadata.size)));
            return strings.join(' · ');
        }
        return '';
    }
}
exports.default = new MetadataTools();
//# sourceMappingURL=metadata.tools.js.map