"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthRouter = void 0;
const express_1 = __importDefault(require("express"));
const oauth_controllers_1 = require("./oauth.controllers");
const oauthRouter = express_1.default.Router();
exports.oauthRouter = oauthRouter;
oauthRouter.get('/oauth/google', oauth_controllers_1.oauthRedirect);
oauthRouter.get(`/oauth/google/callback`, oauth_controllers_1.oauthCallback);
//# sourceMappingURL=oauth.routes.js.map