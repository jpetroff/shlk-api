"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shortlink_schema_1 = __importDefault(require("./schema/shortlink.schema"));
const public_resolvers_1 = __importDefault(require("./resolvers/public.resolvers"));
const user_schema_1 = __importDefault(require("./schema/user.schema"));
const auth_resolvers_1 = __importDefault(require("./resolvers/auth.resolvers"));
const schema_1 = require("@graphql-tools/schema");
const merge_1 = require("@graphql-tools/merge");
const extends_1 = require("./extends");
const mergedTypeDefs = (0, merge_1.mergeTypeDefs)([shortlink_schema_1.default, user_schema_1.default, extends_1.MixedTypeDef]);
const mergedResolvers = (0, merge_1.mergeResolvers)([public_resolvers_1.default, auth_resolvers_1.default, extends_1.MixedResolver]);
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers
});
exports.default = schema;
//# sourceMappingURL=index.js.map