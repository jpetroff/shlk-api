"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.updateUserById = exports.createOrUpdateUser = exports.UserObjectFields = exports.UserProfileFields = void 0;
const user_1 = __importDefault(require("../models/user"));
const underscore_1 = __importDefault(require("underscore"));
const ban_queries_1 = require("./ban.queries");
exports.UserProfileFields = ['email', 'name', 'avatar', 'userTag'];
exports.UserObjectFields = Array().concat(exports.UserProfileFields, ['id_token', 'access_token', 'refresh_token', 'ip']);
async function createOrUpdateUser(args) {
    if (underscore_1.default.isEmpty(args.refresh_token))
        args = underscore_1.default.omit(args, 'refresh_token');
    if (underscore_1.default.isEmpty(args.name))
        args.name = args.email;
    await (0, ban_queries_1.checkBanlist)(args.email, 'user');
    const newParams = underscore_1.default.pick(args, (value, key) => {
        return exports.UserObjectFields.indexOf(key) != -1 &&
            !underscore_1.default.isEmpty(value);
    });
    const user = await user_1.default.findOneAndUpdate({ email: args.email }, newParams, { upsert: true, new: true });
    if (!user.userTag) {
        user.userTag = String(user.name).toLowerCase();
        await user.save();
    }
    return user;
}
exports.createOrUpdateUser = createOrUpdateUser;
async function updateUserById(id, params) {
    const newParams = underscore_1.default.pick(params, (value, key) => {
        return exports.UserProfileFields.indexOf(key) != -1 &&
            !underscore_1.default.isEmpty(value);
    });
    const result = await user_1.default.findByIdAndUpdate(id, newParams, { new: true });
    return result;
}
exports.updateUserById = updateUserById;
async function getUser(id) {
    let loggedUser = await user_1.default.findById(id);
    return loggedUser;
}
exports.getUser = getUser;
//# sourceMappingURL=user.queries.js.map