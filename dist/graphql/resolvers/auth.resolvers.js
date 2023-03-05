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
Object.defineProperty(exports, "__esModule", { value: true });
const user_queries_1 = require("../../libs/user.queries");
const shortlink_queries_1 = require("../../libs/shortlink.queries");
const auth_helpers_1 = require("../../libs/auth.helpers");
const graphql_1 = require("graphql");
const _ = __importStar(require("underscore"));
const extends_1 = require("../extends");
exports.default = {
    Query: {
        getLoggedInUser: async (parent, args, context) => {
            try {
                const userId = context?.req?.session?.userId;
                const loggedUser = await (0, user_queries_1.getUser)(userId);
                if (!loggedUser)
                    return null;
                let loggedProfile = _.pick(loggedUser.toObject(), user_queries_1.UserProfileFields);
                loggedProfile.predefinedTimers = await (0, shortlink_queries_1.queryPredefinedTimers)(userId);
                return loggedProfile;
            }
            catch (error) {
                if (error instanceof graphql_1.GraphQLError) {
                    throw error;
                }
                else {
                    throw new graphql_1.GraphQLError(error.message || String(error), { extensions: error.meta || { code: 'UNKNOWN_ERROR' } });
                }
            }
        },
        getUserShortlinks: async (parent, { args }, context) => {
            try {
                const userId = (0, auth_helpers_1.authUserId)(context?.req);
                const queryArgs = _.extendOwn({ userId: userId }, args);
                const shortlinkList = await (0, shortlink_queries_1.queryShortlinks)(queryArgs);
                return shortlinkList;
            }
            catch (error) {
                throw (0, extends_1.resolveError)(error);
            }
        },
        getPredefinedTimers: async (_, __, context) => {
            const userId = context?.req?.session?.userId;
            return (0, shortlink_queries_1.queryPredefinedTimers)(userId);
        }
    },
    Mutation: {
        updateLoggedInUser: async (parent, { args }, context) => {
            try {
                const userId = (0, auth_helpers_1.authUserId)(context?.req);
                const result = await (0, user_queries_1.updateUserById)(userId, args);
                return result?.toObject() || null;
            }
            catch (error) {
                throw (0, extends_1.resolveError)(error);
            }
        },
        createOrUpdateShortlinkTimer: async (parent, { args }, context) => {
            const userId = context?.req?.session?.userId;
            const shortlink = await (0, shortlink_queries_1.setAwakeTimer)({
                userId: userId,
                ...args
            });
            if (!shortlink)
                return null;
            return shortlink.toObject();
        }
    }
};
//# sourceMappingURL=auth.resolvers.js.map