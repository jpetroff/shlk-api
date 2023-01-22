"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./libs/app"));
const mongo_1 = require("./libs/mongo");
const port = (process.env.PORT || 8002);
mongo_1.mongoConnectPromise
    .then(() => {
    app_1.default.start(port);
})
    .catch((error) => {
    throw error;
});
//# sourceMappingURL=index.js.map