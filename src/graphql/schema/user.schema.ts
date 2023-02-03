export default `
  input QIUserUpdate {
    name: String
    avatar: String
    userTag: String
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
  }
  
  type Mutation {
    updateLoggedInUser(args: QIUserUpdate): User
  }

  schema {
    query: Query
    mutation: Mutation
  }
`