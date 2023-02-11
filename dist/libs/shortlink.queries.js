"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryShortlinks = exports.getShortlink = exports.createShortlinkDescriptor = exports.createShortlink = exports.ShortlinkPublicFields = void 0;
const shortlink_1 = __importDefault(require("../models/shortlink"));
const utils_1 = require("./utils");
const hash_lib_1 = __importDefault(require("./hash.lib"));
const underscore_1 = __importDefault(require("underscore"));
const user_1 = __importDefault(require("../models/user"));
const url_parser_lib_1 = __importDefault(require("./url-parser.lib"));
exports.ShortlinkPublicFields = ['hash', 'descriptor', 'location', 'urlMetadata'];
async function createOrGetShortlink(location, userId, _hash) {
    location = (0, utils_1.normalizeURL)(location);
    let user = null;
    if (userId) {
        user = await user_1.default.findById(userId);
    }
    let tryFindShortlink = null;
    let hash = _hash || (0, hash_lib_1.default)();
    if (user) {
        tryFindShortlink = await shortlink_1.default.findOne({
            owner: user._id,
            location: location
        });
        if (tryFindShortlink)
            return tryFindShortlink;
    }
    tryFindShortlink = await shortlink_1.default.findOne({ hash });
    if (tryFindShortlink &&
        tryFindShortlink.location == location &&
        (0, utils_1.sameOrNoOwnerID)(tryFindShortlink.owner, user?._id)) {
        return tryFindShortlink;
    }
    let newShortlinkObject = {
        hash: tryFindShortlink ? (0, hash_lib_1.default)() : hash,
        location,
    };
    if (user?._id) {
        newShortlinkObject.owner = user._id;
    }
    const newShortlink = new shortlink_1.default(newShortlinkObject);
    if (user?._id)
        underscore_1.default.defer(async () => {
            let urlMetadata = undefined;
            let siteTitle, siteDescription;
            [urlMetadata, siteTitle, siteDescription] = await (0, url_parser_lib_1.default)(location);
            newShortlink.urlMetadata = urlMetadata;
            newShortlink.siteTitle = siteTitle;
            newShortlink.siteDescription = siteDescription;
            newShortlink.save();
        });
    return newShortlink;
}
async function createShortlink(location, userId) {
    const resultShortlinkDocument = await createOrGetShortlink(location, userId);
    const newShortlink = await resultShortlinkDocument.save();
    return newShortlink.toObject();
}
exports.createShortlink = createShortlink;
async function createShortlinkDescriptor(args) {
    args.location = (0, utils_1.normalizeURL)(args.location);
    const existingShortlinkDescription = await shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
    if (existingShortlinkDescription != null &&
        existingShortlinkDescription.location == args.location &&
        (0, utils_1.sameOrNoOwnerID)(args.userId, existingShortlinkDescription.owner)) {
        return existingShortlinkDescription.toObject();
    }
    else if (existingShortlinkDescription != null) {
        throw new utils_1.ExtError(`Shortlink '/${args.userTag}@${args.descriptionTag}' already exists`, { code: 'DUPLICATING_DESCRIPTOR' });
    }
    const shortlinkDocument = await createOrGetShortlink(args.location, args.userId, args.hash);
    shortlinkDocument.descriptor = {
        userTag: args.userTag,
        descriptionTag: args.descriptionTag
    };
    const resultShortlink = await shortlinkDocument.save();
    return resultShortlink.toObject();
}
exports.createShortlinkDescriptor = createShortlinkDescriptor;
async function getShortlink(args) {
    if (args.hash) {
        const shortlink = await shortlink_1.default.findOne({ hash: args.hash });
        return shortlink;
    }
    else if (args.descriptionTag) {
        const shortlink = await shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
        return shortlink;
    }
    else {
        return null;
    }
}
exports.getShortlink = getShortlink;
async function queryShortlinks(args) {
    let results;
    results = shortlink_1.default.find({
        owner: args.userId
    });
    if (args.search) {
        const _s = args.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        results.or([
            { siteTitle: { $regex: new RegExp(_s, 'i') } },
            { siteDescription: { $regex: new RegExp(_s, 'i') } },
            { location: { $regex: new RegExp(_s, 'i') } },
            { 'descriptor.descriptionTag': { $regex: new RegExp(_s, 'i') } }
        ]);
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
    const resultArray = await results.lean();
    return resultArray;
}
exports.queryShortlinks = queryShortlinks;
//# sourceMappingURL=shortlink.queries.js.map