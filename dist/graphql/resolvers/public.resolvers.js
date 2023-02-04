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
const shortlink_queries_1 = require("../../libs/shortlink.queries");
const graphql_1 = require("graphql");
const _ = __importStar(require("underscore"));
const extends_1 = require("../extends");
exports.default = {
    Mutation: {
        createShortlink: (parent, args, context) => {
            var _a, _b;
            try {
                return (0, shortlink_queries_1.createShortlink)(args.location, (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId);
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
            var _a, _b;
            try {
                return (0, shortlink_queries_1.createShortlinkDescriptor)(_.extendOwn({ userId: (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId }, args));
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
        getShortlinkByHash: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                const shortlink = yield (0, shortlink_queries_1.getShortlink)(args);
                if (((_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId) == (shortlink === null || shortlink === void 0 ? void 0 : shortlink.owner)) {
                    return shortlink === null || shortlink === void 0 ? void 0 : shortlink.toObject();
                }
                if (shortlink) {
                    return _.pick(shortlink.toObject(), shortlink_queries_1.ShortlinkPublicFields);
                }
                return null;
            }
            catch (error) {
                return (0, extends_1.resolveError)(error);
            }
        }),
        getShortlinkByDescription: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            try {
                const shortlink = yield (0, shortlink_queries_1.getShortlink)(args);
                if (((_d = (_c = context.req) === null || _c === void 0 ? void 0 : _c.session) === null || _d === void 0 ? void 0 : _d.userId) == (shortlink === null || shortlink === void 0 ? void 0 : shortlink.owner)) {
                    return shortlink === null || shortlink === void 0 ? void 0 : shortlink.toObject();
                }
                if (shortlink) {
                    return _.pick(shortlink.toObject(), shortlink_queries_1.ShortlinkPublicFields);
                }
                return null;
            }
            catch (error) {
                return (0, extends_1.resolveError)(error);
            }
        })
    }
};
//# sourceMappingURL=public.resolvers.js.map