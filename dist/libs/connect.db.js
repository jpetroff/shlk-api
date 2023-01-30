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
exports.MongoDBStore = exports.mongoConnect = exports.appSessionSecret = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_js_1 = __importDefault(require("../config.js"));
const utils_js_1 = require("./utils.js");
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const mongoClusterUri = config_js_1.default.MONGO_FULL
    .replace('{{MONGO_USER}}', config_js_1.default.MONGO_USER)
    .replace('{{MONGO_PASSWORD}}', config_js_1.default.MONGO_PASSWORD)
    .replace('{{MONGO_DB}}', config_js_1.default.MONGO_DB);
exports.appSessionSecret = config_js_1.default.APP_SESSION_SECRET;
mongoose_1.default.set('strictQuery', false);
const options = {};
function mongoConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[…] Connecting to ${utils_js_1.cliColors.yellow}${config_js_1.default.MONGO_DB}${utils_js_1.cliColors.end}: ${mongoClusterUri}`);
        return mongoose_1.default
            .connect(mongoClusterUri, options)
            .then((result) => {
            console.log(`${utils_js_1.cliColors.green}[✓]${utils_js_1.cliColors.end} Connected to ${config_js_1.default.MONGO_DB}`);
        })
            .catch((err) => {
            console.error(`${utils_js_1.cliColors.red}[x]${utils_js_1.cliColors.end} Connection error\n`);
            console.dir(err);
        });
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