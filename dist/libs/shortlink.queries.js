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
exports.deleteShortlink = exports.queryAndDeleteShortlinkSnoozeTimer = exports.queryPredefinedTimers = exports.setAwakeTimer = exports.queryShortlinks = exports.getShortlink = exports.updateShortlink = exports.createShortlinkDescriptor = exports.createShortlink = exports.ShortlinkPublicFields = void 0;
const underscore_1 = __importDefault(require("underscore"));
const shortlink_1 = __importDefault(require("../models/shortlink"));
const user_1 = __importDefault(require("../models/user"));
const hash_lib_1 = __importDefault(require("./hash.lib"));
const url_parser_lib_1 = __importDefault(require("./url-parser.lib"));
const utils_1 = require("./utils");
const snooze_tools_1 = __importStar(require("../libs/snooze.tools"));
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
        underscore_1.default.delay(async () => {
            let urlMetadata = undefined;
            let siteTitle, siteDescription;
            [urlMetadata, siteTitle, siteDescription] = await (0, url_parser_lib_1.default)(location);
            newShortlink.urlMetadata = urlMetadata;
            newShortlink.siteTitle = siteTitle;
            newShortlink.siteDescription = siteDescription;
            newShortlink._searchIndex = `${newShortlink.location}|${newShortlink.descriptor?.descriptionTag || ''}|${newShortlink.siteTitle}|${newShortlink.siteDescription}`;
            newShortlink.save();
        }, 100);
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
    args.descriptionTag = (0, utils_1.modifyURLSlug)(args.descriptionTag);
    const user = await user_1.default.findById(args.userId);
    args.userTag = user?.userTag || 'you';
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
    shortlinkDocument._searchIndex = `${shortlinkDocument.location}|${shortlinkDocument.descriptor?.descriptionTag || ''}|${shortlinkDocument.siteTitle}|${shortlinkDocument.siteDescription}`;
    const resultShortlink = await shortlinkDocument.save();
    return resultShortlink.toObject();
}
exports.createShortlinkDescriptor = createShortlinkDescriptor;
async function updateShortlink(userId, args) {
    const user = await user_1.default.findById(userId);
    let newShortlink = underscore_1.default.defaults({}, args.shortlink);
    const userTag = args.shortlink.descriptor?.userTag || user.userTag;
    if (args.shortlink.descriptor && args.shortlink.descriptor.descriptionTag != '') {
        args.shortlink.descriptor.descriptionTag = (0, utils_1.modifyURLSlug)(args.shortlink.descriptor.descriptionTag);
        const existingShortlinkDescription = await shortlink_1.default.findOne({ descriptor: { userTag, descriptionTag: args.shortlink.descriptor.descriptionTag } });
        if (existingShortlinkDescription && existingShortlinkDescription._id.toString() != args.id) {
            throw new utils_1.ExtError(`Shortlink '/${userTag}@${args.shortlink.descriptor.descriptionTag}' already exists`, { code: 'DUPLICATING_DESCRIPTOR' });
        }
    }
    let unsetRules = {};
    if (!args.shortlink.descriptor || args.shortlink.descriptor?.descriptionTag == '') {
        newShortlink.descriptor = undefined;
        unsetRules.descriptor = true;
    }
    if (args.shortlink.location)
        newShortlink.location = (0, utils_1.normalizeURL)(args.shortlink.location);
    if (!args.shortlink.snooze || !args.shortlink.snooze.awake) {
        newShortlink.snooze = undefined;
        unsetRules.snooze = true;
    }
    const result = await shortlink_1.default.findByIdAndUpdate(args.id, {
        $set: newShortlink,
        $unset: unsetRules
    }, { new: true });
    return result;
}
exports.updateShortlink = updateShortlink;
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
        results.find({ _searchIndex: { $regex: new RegExp(_s, 'i') } });
    }
    if (args.isSnooze) {
        results.find({
            snooze: { $exists: true }
        });
    }
    if (args.sort && args.order) {
        results.sort([[args.sort, args.order]]);
    }
    else {
        results.sort([['createdAt', 'desc']]);
    }
    if (args.skip)
        results.skip(args.skip);
    if (args.limit)
        results.limit(args.limit);
    const resultArray = await results.lean();
    return resultArray;
}
exports.queryShortlinks = queryShortlinks;
async function setAwakeTimer(args) {
    if (!args.userId)
        return null;
    let shortlinkDoc = null;
    if (args.id) {
        try {
            shortlinkDoc = await shortlink_1.default.findById(args.id);
            if (shortlinkDoc?.owner?.toString() != args.userId)
                throw new Error('Shortlink belongs to another user and cannot be modified');
        }
        catch (err) {
            throw new utils_1.ExtError(err.message, { code: 'SNOOZE_MODIFY_ERROR' });
        }
    }
    else if (args.location) {
        shortlinkDoc = await createOrGetShortlink(args.location, args.userId, args.hash);
    }
    if (!shortlinkDoc)
        return null;
    const baseDate = args.baseDateISOString ? new Date(args.baseDateISOString) : new Date();
    if (args.standardTimer) {
        shortlinkDoc.snooze = {
            awake: snooze_tools_1.default.getStandardSnooze(args.standardTimer, baseDate).valueOf(),
            description: snooze_tools_1.default.getStandardDescription(args.standardTimer)
        };
    }
    else if (args.customDay && args.customTime) {
        shortlinkDoc.snooze = {
            awake: snooze_tools_1.default.getCustomSnooze(args.customDay, args.customTime, baseDate).valueOf(),
            description: ''
        };
    }
    await shortlinkDoc.save();
    return shortlinkDoc;
}
exports.setAwakeTimer = setAwakeTimer;
async function queryPredefinedTimers(userId) {
    if (!userId)
        return [];
    let result = [];
    const baseDate = new Date();
    underscore_1.default.each(snooze_tools_1.StandardTimerGroups, (value) => {
        underscore_1.default.each(value.content, (standardSnooze) => {
            result.push({
                groupLabel: value.label,
                groupDate: underscore_1.default.map(value.date, (dateItem) => (snooze_tools_1.default.getCustomSnooze(dateItem, {}, baseDate)).valueOf()),
                label: snooze_tools_1.default.getStandardDescription(standardSnooze),
                value: standardSnooze,
                dateValue: (snooze_tools_1.default.getStandardSnooze(standardSnooze, baseDate)).valueOf()
            });
        });
    });
    return result;
}
exports.queryPredefinedTimers = queryPredefinedTimers;
async function queryAndDeleteShortlinkSnoozeTimer(id) {
    const result = await shortlink_1.default.findByIdAndUpdate(id, { $unset: { snooze: true } }, { new: true });
    return result;
}
exports.queryAndDeleteShortlinkSnoozeTimer = queryAndDeleteShortlinkSnoozeTimer;
async function deleteShortlink(id) {
    const result = await shortlink_1.default.findByIdAndDelete(id);
    return result;
}
exports.deleteShortlink = deleteShortlink;
//# sourceMappingURL=shortlink.queries.js.map