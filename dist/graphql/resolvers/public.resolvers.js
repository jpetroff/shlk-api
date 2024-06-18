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
const shortlink_queries_1 = require("../../libs/shortlink.queries");
const graphql_1 = require("graphql");
const _ = __importStar(require("underscore"));
const extends_1 = require("../extends");
const auth_helpers_1 = require("../../libs/auth.helpers");
exports.default = {
    Mutation: {
        createShortlink: (parent, args, context) => {
            try {
                const userId = (0, auth_helpers_1.authUserId)(context?.req);
                return (0, shortlink_queries_1.createShortlink)(args.location, context.req?.session?.userId);
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
        createDescriptiveShortlink: (parent, args, context) => {
            try {
                const userId = (0, auth_helpers_1.authUserId)(context?.req);
                return (0, shortlink_queries_1.createShortlinkDescriptor)(_.extendOwn({ userId: context.req?.session?.userId }, args));
            }
            catch (error) {
                if (error instanceof graphql_1.GraphQLError) {
                    throw error;
                }
                else {
                    throw new graphql_1.GraphQLError(error.message || String(error), { extensions: error.meta || { code: 'UNKNOWN_ERROR' } });
                }
            }
        }
    },
    Query: {
        getShortlinkByHash: async (parent, args, context) => {
            try {
                const shortlink = await (0, shortlink_queries_1.getShortlink)(args);
                if (context.req?.session?.userId == shortlink?.owner) {
                    return shortlink?.toObject();
                }
                if (shortlink) {
                    return _.pick(shortlink.toObject(), shortlink_queries_1.ShortlinkPublicFields);
                }
                return null;
            }
            catch (error) {
                return (0, extends_1.resolveError)(error);
            }
        },
        getShortlinkByDescription: async (parent, args, context) => {
            try {
                const shortlink = await (0, shortlink_queries_1.getShortlink)(args);
                if (context.req?.session?.userId == shortlink?.owner) {
                    return shortlink?.toObject();
                }
                if (shortlink) {
                    return _.pick(shortlink.toObject(), shortlink_queries_1.ShortlinkPublicFields);
                }
                return null;
            }
            catch (error) {
                return (0, extends_1.resolveError)(error);
            }
        }
    }
};
//# sourceMappingURL=public.resolvers.js.map