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
exports.getUser = exports.createOrUpdateUser = exports.UserObjectFields = exports.UserProfileFields = void 0;
const user_1 = __importDefault(require("../models/user"));
const underscore_1 = __importDefault(require("underscore"));
exports.UserProfileFields = ['email', 'name', 'avatar', 'userTag'];
exports.UserObjectFields = Array().concat(exports.UserProfileFields, ['id_token', 'access_token', 'refresh_token']);
function createOrUpdateUser(args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (underscore_1.default.isEmpty(args.refresh_token))
            args = underscore_1.default.omit(args, 'refresh_token');
        if (underscore_1.default.isEmpty(args.name))
            args.name = args.email;
        const newParams = underscore_1.default.pick(args, (value, key) => {
            return exports.UserObjectFields.indexOf(key) != -1 &&
                !underscore_1.default.isEmpty(value);
        });
        const user = yield user_1.default.findOneAndUpdate({ email: args.email }, newParams, { upsert: true, new: true });
        return user;
    });
}
exports.createOrUpdateUser = createOrUpdateUser;
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const loggedUser = yield user_1.default.findById(id);
        return loggedUser;
    });
}
exports.getUser = getUser;
//# sourceMappingURL=auth-queries.db.js.map