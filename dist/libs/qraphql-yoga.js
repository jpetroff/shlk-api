"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = __importDefault(require("../graphql"));
const graphql_yoga_1 = require("graphql-yoga");
const plugin_disable_introspection_1 = require("@graphql-yoga/plugin-disable-introspection");
const yogaServer = (0, graphql_yoga_1.createYoga)({
    schema: graphql_1.default,
    graphiql: process.env.NODE_ENV == 'development' ? true : false,
    plugins: process.env.NODE_ENV == 'development' ? [] : [(0, plugin_disable_introspection_1.useDisableIntrospection)()],
    graphqlEndpoint: '/api'
});
exports.default = yogaServer;
//# sourceMappingURL=qraphql-yoga.js.map