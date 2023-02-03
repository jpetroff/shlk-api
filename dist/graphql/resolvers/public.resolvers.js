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
const public_queries_db_1 = require("../../libs/public-queries.db");
const _ = __importStar(require("underscore"));
exports.default = {
    Mutation: {
        createShortlink: (parent, args, context) => {
            var _a, _b;
            return (0, public_queries_db_1.createShortlink)(args.location, (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId);
        },
        createDescriptiveShortlink: (parent, args, context) => {
            var _a, _b;
            return (0, public_queries_db_1.createShortlinkDescriptor)(_.extendOwn({ userId: (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId }, args));
        }
    },
    Query: {
        getShortlinkByHash: (parent, args, context) => {
            return (0, public_queries_db_1.getShortlink)(args);
        },
        getShortlinkByDescription: (parent, args, context) => {
            return (0, public_queries_db_1.getShortlink)(args);
        }
    }
};
//# sourceMappingURL=public.resolvers.js.map