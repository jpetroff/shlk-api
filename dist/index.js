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
const app_1 = __importDefault(require("./libs/app"));
const connect_db_1 = require("./libs/connect.db");
const utils_1 = require("./libs/utils");
const port = parseInt(process.env.PORT || '8002');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`\n\n[…] shlk.cc app starting in ${utils_1.cliColors.yellow}${process.env.NODE_ENV}${utils_1.cliColors.end} mode`);
        const mongoose = yield (0, connect_db_1.mongoConnect)();
        if (process.env.NODE_ENV == 'production')
            app_1.default.useHelmet();
        app_1.default.useSessionStorage(connect_db_1.MongoDBStore)
            .mountRoutes()
            .start(port);
    });
}
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map