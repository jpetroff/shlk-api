"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnectPromise = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_creds_json_1 = __importDefault(require("../mongo_creds.json"));
const mongoClusterUri = mongo_creds_json_1.default.MONGO_FULL
    .replace('{{MONGO_USER}}', mongo_creds_json_1.default.MONGO_USER)
    .replace('{{MONGO_PASSWORD}}', mongo_creds_json_1.default.MONGO_PASSWORD)
    .replace('{{MONGO_DB}}', mongo_creds_json_1.default.MONGO_DB);
console.log(mongoClusterUri);
const options = { useNewUrlParser: true, useUnifiedTopology: true };
exports.mongoConnectPromise = mongoose_1.default
    .connect(mongoClusterUri, options);
//# sourceMappingURL=mongo.js.map