"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_beautiful_unique_validation_1 = __importDefault(require("mongoose-beautiful-unique-validation"));
const Schema = mongoose_1.default.Schema;
const shortlinkSchema = new Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
    },
    descriptor: {
        userTag: { type: String },
        descriptionTag: { type: String }
    }
}, { timestamps: true });
shortlinkSchema.plugin(mongoose_beautiful_unique_validation_1.default);
exports.default = mongoose_1.default.model("Shortlink", shortlinkSchema);
//# sourceMappingURL=shortlink.js.map