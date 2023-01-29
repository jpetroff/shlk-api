"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortlink_schema_1 = __importDefault(require("./schema/shortlink.schema"));
const public_resolvers_1 = __importDefault(require("./resolvers/public.resolvers"));
const schema_1 = require("@graphql-tools/schema");
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: shortlink_schema_1.default,
    resolvers: public_resolvers_1.default
});
exports.default = schema;
//# sourceMappingURL=index.js.map