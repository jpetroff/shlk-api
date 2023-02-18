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
exports.parser = exports.parse = void 0;
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = require("node-html-parser");
const metadata_tools_1 = __importDefault(require("./metadata.tools"));
const _ = __importStar(require("underscore"));
const readMT = (el, name) => {
    var prop = el.getAttribute('name') || el.getAttribute('property');
    return prop == name ? el.getAttribute('content') : null;
};
const parse = async (url) => {
    console.log(url);
    const prefetch = axios_1.default.create({
        url,
        maxBodyLength: 1024 * 1024 * 2,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10) AppleWebKit (KHTML, like Gecko) Chrome Safari',
            'Referer': 'https://shlk.cc',
            'Viewport-Width': '960',
            'Cache-Control': 'no-cache',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    });
    let fetchedHeaders;
    try {
        fetchedHeaders = await prefetch.head(url);
    }
    catch {
        return [{ type: 'invalid url' }, 'Site not accessible', ''];
    }
    let partialMeta = {
        type: fetchedHeaders.headers['content-type'] || 'unknown',
        size: fetchedHeaders.headers['content-length'] ? parseInt(fetchedHeaders.headers['content-length']) : undefined,
        encoding: fetchedHeaders.headers['content-encoding'] || 'utf-8'
    };
    let meta = {};
    let og = {};
    if (partialMeta.type.match(/html/ig) != null) {
        try {
            const urlObject = new URL(url);
            const { data } = await prefetch.get(urlObject.toString());
            const $ = (0, node_html_parser_1.parse)(data);
            const title = $.querySelector('title');
            if (title)
                meta.title = title.text;
            const canonical = $.querySelector('link[rel=canonical]');
            if (canonical) {
                meta.url = canonical.getAttribute('href');
            }
            const favicons = $.querySelectorAll('link[rel~=icon]');
            let faviconList = [];
            for (let i = 0; i < favicons.length; i++) {
                const el = favicons[i];
                const href = el.getAttribute('href');
                if (href && /\.(jpe?g|png|gif|ico)(\?.*$)?/ig.test(href)) {
                    let fullUrl = '';
                    try {
                        fullUrl = (new URL(href, urlObject.origin)).toString();
                        faviconList.push({
                            src: fullUrl,
                            sizes: el.getAttribute('sizes')
                        });
                    }
                    catch { }
                }
            }
            if (faviconList.length == 0) {
                try {
                    const defaultFaviconUrl = new URL('/favicon.ico', urlObject.origin);
                    const hasDefault = await prefetch.head(defaultFaviconUrl.toString());
                    if (hasDefault.headers && hasDefault.headers['content-type'] && /image/ig.test(hasDefault.headers['content-type']))
                        faviconList.push({ src: defaultFaviconUrl.toString() });
                }
                catch { }
            }
            meta.favicons = metadata_tools_1.default.sortFaviconList(faviconList) || [];
            const metas = $.querySelectorAll('meta');
            for (let i = 0; i < metas.length; i++) {
                const el = metas[i];
                ['title', 'description', 'image'].forEach((s) => {
                    const val = readMT(el, s);
                    if (val)
                        meta[s] = val;
                });
                ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach(s => {
                    const val = readMT(el, s);
                    if (val)
                        og[s.split(':')[1]] = val;
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    let returnMeta = _.extend({}, partialMeta, meta, { og: og });
    const metaParams = { location: url, urlMetadata: returnMeta };
    const siteTitle = metadata_tools_1.default.getTitle(metaParams) || '';
    const siteDescription = metadata_tools_1.default.getDescription(metaParams) || '';
    const defaultFavicon = metadata_tools_1.default.getDefaultFavicon(returnMeta.favicons);
    if (defaultFavicon)
        returnMeta.favicons?.splice(0, 0, defaultFavicon);
    return [returnMeta, siteTitle, siteDescription];
};
exports.parse = parse;
const parser = parse;
exports.parser = parser;
exports.default = parser;
//# sourceMappingURL=url-parser.lib.js.map