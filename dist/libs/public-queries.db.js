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
const underscore_1 = __importDefault(require("underscore"));
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("../models/user"));
function createShortlink(location, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user;
            if (userId) {
                user = yield user_1.default.findById(userId);
                if (user) {
                    const tryFindLink = yield shortlink_1.default.findOne({
                        owner: user._id,
                        location
                    });
                    if (tryFindLink)
                        return tryFindLink;
                }
            }
            const shortlink = new shortlink_1.default({
                hash: (0, hash_lib_1.default)(),
                location: (0, utils_1.prepareURL)(location),
                owner: (user === null || user === void 0 ? void 0 : user._id) || undefined
            });
            const newShortlink = yield shortlink.save();
            return newShortlink;
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
        args.location = (0, utils_1.prepareURL)(args.location);
        const existingShortlinkDescription = yield shortlink_1.default.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } });
        try {
            if (existingShortlinkDescription != null && existingShortlinkDescription.location == args.location) {
                return existingShortlinkDescription;
            }
            else if (existingShortlinkDescription != null) {
                throw new graphql_1.GraphQLError(`Shortlink '${args.userTag}@${args.descriptionTag}' already exists`, {
                    extensions: { code: 'DUPLICATING_DESCRIPTOR' }
                });
            }
            else if (args.hash && !underscore_1.default.isEmpty(args.hash)) {
                const existingShortlinkHash = yield getShortlink({ hash: args.hash });
                if (existingShortlinkHash != null && existingShortlinkHash.location != args.location) {
                    throw new graphql_1.GraphQLError(`Cannot update: Hash /${args.hash} is taken by another location '${args.location}'`, {
                        extensions: { code: 'DUPLICATING_HASH' }
                    });
                }
                else if (existingShortlinkHash == null) {
                    const shortlink = new shortlink_1.default({
                        hash: args.hash,
                        location: args.location,
                        descriptor: {
                            userTag: args.userTag,
                            descriptionTag: args.descriptionTag
                        }
                    });
                    const newShortlink = yield shortlink.save();
                    return newShortlink;
                }
                else {
                    const update = yield shortlink_1.default.findOneAndUpdate({
                        hash: args.hash
                    }, {
                        descriptor: {
                            userTag: args.userTag,
                            descriptionTag: args.descriptionTag
                        }
                    });
                    const updatedShortlink = yield shortlink_1.default.findById(update._id);
                    return updatedShortlink;
                }
            }
            else {
                const shortlink = new shortlink_1.default({
                    hash: (0, hash_lib_1.default)(),
                    location: args.location,
                    descriptor: {
                        userTag: args.userTag,
                        descriptionTag: args.descriptionTag
                    }
                });
                const newShortlink = yield shortlink.save();
                return newShortlink;
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