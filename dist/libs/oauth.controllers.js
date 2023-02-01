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
exports.sessionLogout = exports.oauthCallback = exports.oauthRedirect = void 0;
const google_auth_library_1 = require("google-auth-library");
const config_1 = __importDefault(require("../config"));
const auth_queries_db_1 = require("./auth-queries.db");
const googleapis_1 = require("googleapis");
function getAuthClient() {
    return new google_auth_library_1.OAuth2Client(config_1.default.web.client_id, config_1.default.web.client_secret, config_1.default.web.redirect_uris[0]);
}
function oauthRedirect(req, res) {
    const oAuth2Client = getAuthClient();
    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' ')
    });
    res.redirect(authorizeUrl);
}
exports.oauthRedirect = oauthRedirect;
function oauthCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const qs = new URL(req.url, 'https://shlk.cc/').searchParams;
        const code = qs.get('code');
        const oAuth2Client = getAuthClient();
        if (!code) {
            res.sendStatus(400).json({ message: 'Authorization failed' });
        }
        else {
            try {
                const r = yield oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(r.tokens);
                const gapi = googleapis_1.google.oauth2({
                    auth: oAuth2Client,
                    version: 'v2'
                });
                const { data } = yield gapi.userinfo.v2.me.get();
                if (!data.email || !data.verified_email)
                    throw new Error('Your email is not verified. Please verify before signing in');
                const user = yield (0, auth_queries_db_1.createOrUpdateUser)({
                    email: data.email,
                    name: data.given_name || data.family_name || data.email,
                    avatar: data.picture,
                    id_token: r.tokens.id_token,
                    access_token: r.tokens.access_token,
                    refresh_token: r.tokens.refresh_token
                });
                req.session.userId = user === null || user === void 0 ? void 0 : user._id;
                req.session.tokens = r.tokens;
                res.redirect('/');
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        }
    });
}
exports.oauthCallback = oauthCallback;
function sessionLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.send(400).json(JSON.stringify(err));
            return;
        }
        res.redirect('/');
    });
}
exports.sessionLogout = sessionLogout;
//# sourceMappingURL=oauth.controllers.js.map