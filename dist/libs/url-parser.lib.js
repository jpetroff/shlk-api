"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.parse = void 0;
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = require("node-html-parser");
const readMT = (el, name) => {
    var prop = el.getAttribute('name') || el.getAttribute('property');
    return prop == name ? el.getAttribute('content') : null;
};
const parse = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const prefetch = axios_1.default.create({
        url,
        timeout: 2000,
        maxBodyLength: 1024 * 1024 * 2,
        headers: {
            'X-Custom-Header': 'foobar'
        }
    });
    const fetchedHeaders = yield prefetch.head(url);
    let partialMeta = {
        type: fetchedHeaders.headers['content-type'] || 'unknown',
        size: fetchedHeaders.headers['content-length'] ? parseInt(fetchedHeaders.headers['content-length']) : undefined,
        encoding: fetchedHeaders.headers['content-encoding'] || 'utf-8'
    };
    if (partialMeta.type.match(/html/ig) == null) {
        return partialMeta;
    }
    const { data } = yield prefetch.get(url);
    const $ = (0, node_html_parser_1.parse)(data);
    let meta = {};
    let og = {};
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
        if (href && /\.(jpe?g|png|gif)$/ig.test(href))
            faviconList.push({
                src: href,
                sizes: el.getAttribute('sizes')
            });
    }
    if (faviconList.length > 0)
        meta.favicons = faviconList;
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
    return Object.assign(Object.assign(Object.assign({}, partialMeta), meta), { og });
});
exports.parse = parse;
const parser = parse;
exports.parser = parser;
exports.default = parser;
//# sourceMappingURL=url-parser.lib.js.map