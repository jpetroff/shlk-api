"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBanlist = void 0;
const banlist_1 = __importDefault(require("../models/banlist"));
const underscore_1 = __importDefault(require("underscore"));
const utils_1 = require("./utils");
async function checkBanlist(_value, type, useReject = false) {
    let banlist = await banlist_1.default.find({ type });
    const value = _value.trim();
    const banvalues = underscore_1.default.map(banlist, (banitem) => banitem.value);
    let hasItem = false;
    if (type == 'location') {
        hasItem = underscore_1.default.reduce(banvalues, (result, _banvalue) => {
            const banvalue = _banvalue.trim();
            if (banvalue[0] == '/' && banvalue[banvalue.length - 1] == '/') {
                return result || (new RegExp(banvalue.replaceAll('/', '')).test(value));
            }
            else {
                return result || (banvalue == value);
            }
        }, hasItem);
    }
    else {
        hasItem = underscore_1.default.reduce(banvalues, (result, _banvalue) => {
            const banvalue = _banvalue.trim();
            return result || (banvalue == value);
        }, hasItem);
    }
    if (hasItem && !useReject)
        throw (new utils_1.ExtError(`Sorry, this action is forbidden`, {
            code: 'BANNED'
        }));
    if (hasItem && useReject)
        return Promise.reject(new utils_1.ExtError(`Sorry, this action is forbidden`, {
            code: 'BANNED'
        }));
}
exports.checkBanlist = checkBanlist;
//# sourceMappingURL=ban.queries.js.map