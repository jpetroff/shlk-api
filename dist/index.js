"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./libs/app"));
const connect_db_1 = require("./libs/connect.db");
const utils_1 = require("./libs/utils");
const port = parseInt(process.env.PORT || '8002');
async function main() {
    console.log(`\n\n[…] shlk.cc app starting in ${utils_1.cliColors.yellow}${process.env.NODE_ENV}${utils_1.cliColors.end} mode`);
    const mongoose = await (0, connect_db_1.mongoConnect)();
    if (process.env.NODE_ENV == 'production')
        app_1.default.useHelmet();
    app_1.default.useIPCheck();
    app_1.default.useSessionStorage(connect_db_1.MongoDBStore)
        .mountRoutes()
        .start(port);
}
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map