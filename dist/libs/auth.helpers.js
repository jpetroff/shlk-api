"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserId = void 0;
const utils_1 = require("./utils");
function authUserId(req) {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.userId) {
        return req.session.userId;
    }
    else {
        throw new utils_1.ExtError(`You need to log in to use this`, { code: 'FORBIDDEN' });
    }
}
exports.authUserId = authUserId;
//# sourceMappingURL=auth.helpers.js.map