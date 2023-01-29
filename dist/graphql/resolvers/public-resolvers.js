"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_queries_db_1 = require("../../libs/public-queries.db");
exports.default = {
    Mutation: {
        createShortlink: (parent, args) => {
            return (0, public_queries_db_1.createShortlink)(args.location);
        },
        createDescriptiveShortlink: (parent, args) => {
            return (0, public_queries_db_1.createShortlinkDescriptor)(args);
        }
    },
    Query: {
        getShortlinkByHash: (parent, args) => {
            return (0, public_queries_db_1.getShortlink)(args);
        },
        getShortlinkByDescription: (parent, args) => {
            return (0, public_queries_db_1.getShortlink)(args);
        }
    }
};
//# sourceMappingURL=public-resolvers.js.map