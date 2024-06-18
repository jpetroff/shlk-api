"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    },
    userTag: {
        type: String
    },
    id_token: {
        type: String,
        unique: true
    },
    access_token: {
        type: String,
        unique: true
    },
    refresh_token: {
        type: String,
        unique: true
    },
    ip: {
        type: String
    },
}, { timestamps: true });
userSchema.plugin(mongoose_beautiful_unique_validation_1.default);
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.js.map