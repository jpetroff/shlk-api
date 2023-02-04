export default `
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
  }

  schema {
    query: Query
    mutation: Mutation
  }
`