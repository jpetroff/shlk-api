"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_queries_db_1 = require("../../libs/public-queries.db");
exports.default = {
    Mutation: {
        createShortlink: (parent, args, context) => {
            var _a, _b;
            return (0, public_queries_db_1.createShortlink)(args.location, (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.session) === null || _b === void 0 ? void 0 : _b.userId);
        },
        createDescriptiveShortlink: (parent, args, context) => {
            return (0, public_queries_db_1.createShortlinkDescriptor)(args);
        }
    },
    Query: {
        getShortlinkByHash: (parent, args, context) => {
            return (0, public_queries_db_1.getShortlink)(args);
        },
        getShortlinkByDescription: (parent, args, context) => {
            return (0, public_queries_db_1.getShortlink)(args);
        }
    }
};
//# sourceMappingURL=public.resolvers.js.map