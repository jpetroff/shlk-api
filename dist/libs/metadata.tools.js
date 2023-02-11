"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const link_tools_1 = __importDefault(require("./link.tools"));
class MetadataTools {
    constructor() { }
    getDefaultFavicon(list) {
        if (!list)
            return { src: '/assets/default-favicon.png', sizes: 'default' };
        return { src: '/assets/default-favicon.png', sizes: 'default' };
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
            const v1 = (shortlink.urlMetadata.description ||
                shortlink.urlMetadata.og?.description ||
                '');
            const v2 = [
                shortlink.urlMetadata.og?.type || '',
                shortlink.urlMetadata.og?.site_name || ''
            ].join(' · ');
            return v1.trim() || v2.trim() || '';
        }
        if (/image/ig.test(type)) {
            return [
                'Image',
                shortlink.urlMetadata.size || ''
            ].join(' · ');
        }
        if (/video/ig.test(type)) {
            return [
                'Video',
                shortlink.urlMetadata.size || ''
            ].join(' · ');
        }
        return '';
    }
}
exports.default = new MetadataTools();
//# sourceMappingURL=metadata.tools.js.map