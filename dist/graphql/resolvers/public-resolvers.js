"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_public_queries_1 = require("../../libs/mongo-public-queries");
exports.default = {
    Mutation: {
        createShortlink: (parent, args) => {
            return (0, mongo_public_queries_1.createShortlink)(args.location);
        },
        createDescriptiveShortlink: (parent, args) => {
            return (0, mongo_public_queries_1.createShortlinkDescriptor)(args);
        }
    },
    Query: {
        getShortlinkByHash: (parent, args) => {
            return (0, mongo_public_queries_1.getShortlink)(args);
        },
        getShortlinkByDescription: (parent, args) => {
            return (0, mongo_public_queries_1.getShortlink)(args);
        }
    }
};
//# sourceMappingURL=public-resolvers.js.map