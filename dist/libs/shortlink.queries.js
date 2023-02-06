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
exports.queryShortlinks = exports.getShortlink = exports.createShortlinkDescriptor = exports.createShortlink = exports.ShortlinkPublicFields = void 0;
const shortlink_1 = __importDefault(require("../models/shortlink"));
const utils_1 = require("./utils");
const hash_lib_1 = __importDefault(require("./hash.lib"));
const user_1 = __importDefault(require("../models/user"));
const url_parser_lib_1 = __importDefault(require("./url-parser.lib"));
exports.ShortlinkPublicFields = ['hash', 'descriptor', 'location', 'urlMetadata'];
function createOrGetShortlink(location, userId, _hash) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        location = (0, utils_1.normalizeURL)(location);
        let user = null;
        if (userId) {
            user = yield user_1.default.findById(userId);
        }
        let tryFindShortlink = null;
        let hash = _hash || (0, hash_lib_1.default)();
        if (user) {
            tryFindShortlink = yield shortlink_1.default.findOne({
                owner: user._id,
                location: location
            });
            if (tryFindShortlink)
                return tryFindShortlink;
        }
        tryFindShortlink = yield shortlink_1.default.findOne({ hash });
        if (tryFindShortlink &&
            tryFindShortlink.location == location &&
            (0, utils_1.sameOrNoOwnerID)(tryFindShortlink.owner, user === null || user === void 0 ? void 0 : user._id)) {
            return tryFindShortlink;
        }
        let newShortlinkObject = {
            hash: tryFindShortlink ? (0, hash_lib_1.default)() : hash,
            location,
        };
        if (user === null || user === void 0 ? void 0 : user._id) {
            newShortlinkObject.owner = user._id;
            let urlMetadata = null;
            try {
                urlMetadata = yield (0, url_parser_lib_1.default)(location);
            }
            catch (_c) { }
            if (urlMetadata) {
                newShortlinkObject.urlMetadata = urlMetadata;
                newShortlinkObject.siteTitle = ((_a = urlMetadata.og) === null || _a === void 0 ? void 0 : _a.title) || urlMetadata.title;
                newShortlinkObject.siteDescription = ((_b = urlMetadata.og) === null || _b === void 0 ? void 0 : _b.description) || urlMetadata.description;
            }
        }
        const newShortlink = new shortlink_1.default(newShortlinkObject);
        return newShortlink;
    });
}
function createShortlink(location, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultShortlinkDocument = yield createOrGetShortlink(location, userId);
        const newShortlink = yield resultShortlinkDocument.save();
        return newShortlink.toObject();
    });
}
exports.createShortlink = createShortlink;
function createShortlinkDescriptor(args) {
    return __awaiter(this, void 0, void 0, function* () {
        args.location = (0, utils_1.normalizeURL)(args.location);
        const existingShortlinkDescription = yield shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
        if (existingShortlinkDescription != null &&
            existingShortlinkDescription.location == args.location &&
            (0, utils_1.sameOrNoOwnerID)(args.userId, existingShortlinkDescription.owner)) {
            return existingShortlinkDescription.toObject();
        }
        else if (existingShortlinkDescription != null) {
            throw new utils_1.ExtError(`Shortlink '/${args.userTag}@${args.descriptionTag}' already exists`, { code: 'DUPLICATING_DESCRIPTOR' });
        }
        const shortlinkDocument = yield createOrGetShortlink(args.location, args.userId, args.hash);
        shortlinkDocument.descriptor = {
            userTag: args.userTag,
            descriptionTag: args.descriptionTag
        };
        const resultShortlink = yield shortlinkDocument.save();
        return resultShortlink.toObject();
    });
}
exports.createShortlinkDescriptor = createShortlinkDescriptor;
function getShortlink(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (args.hash) {
            const shortlink = yield shortlink_1.default.findOne({ hash: args.hash });
            return shortlink;
        }
        else if (args.descriptionTag) {
            const shortlink = yield shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
            return shortlink;
        }
        else {
            return null;
        }
    });
}
exports.getShortlink = getShortlink;
function queryShortlinks(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let results;
        results = shortlink_1.default.find({
            owner: args.userId
        });
        if (args.search) {
            results = results.find({
                $text: {
                    $search: args.search,
                    $caseSensitive: false,
                    $diacriticSensitive: false
                }
            });
        }
        if (args.sort && args.order) {
            results.sort([[args.sort, args.order]]);
        }
        else {
            results.sort([['updatedAt', 'desc']]);
        }
        if (args.skip)
            results.skip(args.skip);
        if (args.limit)
            results.limit(args.limit);
        const resultArray = yield results.lean();
        return resultArray;
    });
}
exports.queryShortlinks = queryShortlinks;
//# sourceMappingURL=shortlink.queries.js.map