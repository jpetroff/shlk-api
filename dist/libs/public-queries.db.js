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
exports.getShortlink = exports.createShortlinkDescriptor = exports.createShortlink = void 0;
const shortlink_1 = __importDefault(require("../models/shortlink"));
const utils_1 = require("./utils");
const hash_lib_1 = __importDefault(require("./hash.lib"));
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("../models/user"));
const url_metadata_1 = __importDefault(require("url-metadata"));
function createOrGetShortlink(location, userId, _hash) {
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
            const urlMetadata = yield (0, url_metadata_1.default)(location);
            newShortlinkObject.owner = user._id;
            newShortlinkObject.urlMetadata = urlMetadata;
        }
        const newShortlink = new shortlink_1.default(newShortlinkObject);
        return newShortlink;
    });
}
function createShortlink(location, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resultShortlinkDocument = yield createOrGetShortlink(location, userId);
            const newShortlink = yield resultShortlinkDocument.save();
            return newShortlink.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: { code: 'OTHER_MONGO_ERROR' }
                });
            }
            else {
                throw new graphql_1.GraphQLError(String(error), {
                    extensions: { code: 'UNKNOWN_ERROR' }
                });
            }
        }
    });
}
exports.createShortlink = createShortlink;
function createShortlinkDescriptor(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            args.location = (0, utils_1.normalizeURL)(args.location);
            const existingShortlinkDescription = yield shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
            if (existingShortlinkDescription != null &&
                existingShortlinkDescription.location == args.location &&
                (0, utils_1.sameOrNoOwnerID)(args.userId, existingShortlinkDescription.owner)) {
                return existingShortlinkDescription.toObject();
            }
            else if (existingShortlinkDescription != null) {
                throw new graphql_1.GraphQLError(`Shortlink '/${args.userTag}@${args.descriptionTag}' already exists`, { extensions: { code: 'DUPLICATING_DESCRIPTOR' } });
            }
            const shortlinkDocument = yield createOrGetShortlink(args.location, args.userId, args.hash);
            shortlinkDocument.descriptor = {
                userTag: args.userTag,
                descriptionTag: args.descriptionTag
            };
            const resultShortlink = yield shortlinkDocument.save();
            return resultShortlink.toObject();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: { code: 'OTHER_MONGO_ERROR' }
                });
            }
            else {
                throw new graphql_1.GraphQLError(String(error), {
                    extensions: { code: 'UNKNOWN_ERROR' }
                });
            }
        }
    });
}
exports.createShortlinkDescriptor = createShortlinkDescriptor;
function getShortlink(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
        }
        catch (error) {
            if (error instanceof Error) {
                throw new graphql_1.GraphQLError(error.message, {
                    extensions: { code: 'OTHER_MONGO_ERROR' }
                });
            }
            else {
                throw new graphql_1.GraphQLError(String(error), {
                    extensions: { code: 'UNKNOWN_ERROR' }
                });
            }
        }
    });
}
exports.getShortlink = getShortlink;
//# sourceMappingURL=public-queries.db.js.map