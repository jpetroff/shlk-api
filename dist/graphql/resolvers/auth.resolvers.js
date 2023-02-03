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
const auth_queries_db_1 = require("../../libs/auth-queries.db");
const _ = __importStar(require("underscore"));
exports.default = {
    Query: {
        getLoggedInUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!((_a = context.req.session) === null || _a === void 0 ? void 0 : _a.userId))
                return null;
            const loggedUser = yield (0, auth_queries_db_1.getUser)(context.req.session.userId);
            if (!loggedUser)
                return null;
            const loggedProfile = _.pick(loggedUser, auth_queries_db_1.UserProfileFields);
            return loggedProfile;
        })
    },
    Mutation: {
        updateLoggedInUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            return null;
        })
    }
};
//# sourceMappingURL=auth.resolvers.js.map