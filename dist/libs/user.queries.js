"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createOrUpdateUser = exports.UserObjectFields = exports.UserProfileFields = void 0;
const user_1 = __importDefault(require("../models/user"));
const underscore_1 = __importDefault(require("underscore"));
exports.UserProfileFields = ['email', 'name', 'avatar', 'userTag'];
exports.UserObjectFields = Array().concat(exports.UserProfileFields, ['id_token', 'access_token', 'refresh_token']);
async function createOrUpdateUser(args) {
    if (underscore_1.default.isEmpty(args.refresh_token))
        args = underscore_1.default.omit(args, 'refresh_token');
    if (underscore_1.default.isEmpty(args.name))
        args.name = args.email;
    const newParams = underscore_1.default.pick(args, (value, key) => {
        return exports.UserObjectFields.indexOf(key) != -1 &&
            !underscore_1.default.isEmpty(value);
    });
    const user = await user_1.default.findOneAndUpdate({ email: args.email }, newParams, { upsert: true, new: true });
    return user;
}
exports.createOrUpdateUser = createOrUpdateUser;
async function getUser(id) {
    const loggedUser = await user_1.default.findById(id);
    return loggedUser;
}
exports.getUser = getUser;
//# sourceMappingURL=user.queries.js.map