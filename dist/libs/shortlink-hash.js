"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random_hash_1 = require("random-hash");
const crypto_1 = require("crypto");
const generateHash = new random_hash_1.RandomHash({
    length: 4,
    charset: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789uwetag',
    rng: crypto_1.randomBytes
});
exports.default = generateHash;
//# sourceMappingURL=shortlink-hash.js.map