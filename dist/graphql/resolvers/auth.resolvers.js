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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
        getLoggedInUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_b = (_a = context === null || context === void 0 ? void 0 : context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId;
                const loggedUser = yield (0, user_queries_1.getUser)(userId);
                if (!loggedUser)
                    return null;
                const loggedProfile = _.pick(loggedUser.toObject(), user_queries_1.UserProfileFields);
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
        }),
        getUserShortlinks: (parent, argsObj, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userId = (0, auth_helpers_1.authUserId)(context === null || context === void 0 ? void 0 : context.req);
                const queryArgs = _.extendOwn({ userId: userId }, argsObj.args);
                const shortlinkList = yield (0, shortlink_queries_1.queryShortlinks)(queryArgs);
                return shortlinkList;
            }
            catch (error) {
                throw (0, extends_1.resolveError)(error);
            }
        })
    },
    Mutation: {
        updateLoggedInUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return null;
        })
    }
};
//# sourceMappingURL=auth.resolvers.js.map