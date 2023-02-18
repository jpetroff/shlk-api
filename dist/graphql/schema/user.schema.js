"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
  input QIUserUpdate {
    name: String
    avatar: String
    userTag: String
  }

  input QIUserShortlinks {
    limit: Int
    skip: Int
    sort: String
    order: String
    search: String
  }

  input QISnoozeArgs {
    location: String
    hash: String
    id: String
    standardTimer: String
    customDay: Mixed
    customTime: Mixed
  }

  type User {
    _id: ID!
    email: String!

    name: String!
    avatar: String
    userTag: String

    createdAt: String
    updatedAt: String
  }

  type Query {
    getLoggedInUser: User
    getUserShortlinks(args: QIUserShortlinks): [Shortlink]
  }
  
  type Mutation {
    updateLoggedInUser(args: QIUserUpdate): User
    createOrUpdateShortlinkTimer(args: QISnoozeArgs) : Shortlink
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
//# sourceMappingURL=user.schema.js.map