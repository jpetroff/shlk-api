// import { buildSchema } from 'graphql'

export default `
  input QIUserUpdate {
    name: String
    userTag: String
  }


  type User {
    _id: ID!
    email: String!

    name: String!
    userTag: String

    createdAt: String
    updatedAt: String
  }

  type Query {
    getUser(_id: String!): User
  }
  
  type Mutation {
    updateUser(args: QIUserUpdate): User
  }

  schema {
    query: Query
    mutation: Mutation
  }
`