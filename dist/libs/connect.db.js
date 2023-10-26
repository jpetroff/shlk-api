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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBStore = exports.mongoConnect = exports.appSessionSecret = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config = __importStar(require("../config"));
const utils_js_1 = require("./utils.js");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const mongoClusterUri = config.MONGO_FULL
    .replace('{{MONGO_USER}}', config.MONGO_USER)
    .replace('{{MONGO_PASSWORD}}', config.MONGO_PASSWORD)
    .replace('{{MONGO_DB}}', config.MONGO_DB);
exports.appSessionSecret = config.APP_SESSION_SECRET;
mongoose_1.default.set('strictQuery', false);
const options = {};
async function mongoConnect() {
    console.log(`[…] Connecting to ${utils_js_1.cliColors.yellow}${config.MONGO_DB}${utils_js_1.cliColors.end}: ${mongoClusterUri}`);
    return mongoose_1.default
        .connect(mongoClusterUri, options)
        .then((result) => {
        console.log(`${utils_js_1.cliColors.green}[✓]${utils_js_1.cliColors.end} Connected to ${config.MONGO_DB}`);
    })
        .catch((err) => {
        console.error(`${utils_js_1.cliColors.red}[x]${utils_js_1.cliColors.end} Connection error\n`);
        console.dir(err);
    });
}
exports.mongoConnect = mongoConnect;
const MongoDBCreateStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
exports.MongoDBStore = new MongoDBCreateStore({
    uri: mongoClusterUri,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 30 * 6,
});
//# sourceMappingURL=connect.db.js.map