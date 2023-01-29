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
exports.oauthRouter = void 0;
const express_1 = __importDefault(require("express"));
const google_auth_library_1 = require("google-auth-library");
const keys = require('../../client_secret_652965437671-7sp6dqu6phcnj0dvtv3i5h5f9flicoed.apps.googleusercontent.com.json');
const oauthRouter = express_1.default.Router();
exports.oauthRouter = oauthRouter;
const oAuth2Client = new google_auth_library_1.OAuth2Client(keys.web.client_id, keys.web.client_secret, keys.web.redirect_uris[1]);
oauthRouter.get('/oauth/google', (req, res) => {
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' ')
    });
    res.redirect(authorizeUrl);
});
oauthRouter.get(`/oauth/google/callback`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.dir(req.url);
    const qs = new URL(req.url, 'https://shlk.cc/').searchParams;
    const code = qs.get('code');
    console.log(`Code is ${code}`);
    if (!code) {
        res.sendStatus(404).json({ message: 'Authorization failed' });
    }
    else {
        const r = yield oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(r.tokens);
        console.info('Tokens acquired.', r);
    }
}));
//# sourceMappingURL=oauth-router.js.map