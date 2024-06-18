"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserId = void 0;
const utils_1 = require("./utils");
function authUserId(req) {
    if (req?.session?.userId) {
        return req.session.userId;
    }
    else {
        throw new utils_1.ExtError(`Please, log in with Google account to use the app`, { code: 'FORBIDDEN' });
    }
}
exports.authUserId = authUserId;
//# sourceMappingURL=auth.helpers.js.map