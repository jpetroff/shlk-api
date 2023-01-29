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
exports.mongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_creds_js_1 = __importDefault(require("../mongo_creds.js"));
const utils_js_1 = require("./utils.js");
const mongoClusterUri = mongo_creds_js_1.default.MONGO_FULL
    .replace('{{MONGO_USER}}', mongo_creds_js_1.default.MONGO_USER)
    .replace('{{MONGO_PASSWORD}}', mongo_creds_js_1.default.MONGO_PASSWORD)
    .replace('{{MONGO_DB}}', mongo_creds_js_1.default.MONGO_DB);
mongoose_1.default.set('strictQuery', false);
const options = {};
function mongoConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[…] Connecting to ${utils_js_1.cliColors.yellow}${mongo_creds_js_1.default.MONGO_DB}${utils_js_1.cliColors.end}: ${mongoClusterUri}`);
        return mongoose_1.default
            .connect(mongoClusterUri, options)
            .then((result) => {
            console.log(`${utils_js_1.cliColors.green}[✓]${utils_js_1.cliColors.end} Connected to ${mongo_creds_js_1.default.MONGO_DB}`);
        })
            .catch((err) => {
            console.error(`${utils_js_1.cliColors.red}[×]${utils_js_1.cliColors.end} Connection error\n`);
            console.dir(err);
        });
    });
}
exports.mongoConnect = mongoConnect;
//# sourceMappingURL=connect.db.js.map