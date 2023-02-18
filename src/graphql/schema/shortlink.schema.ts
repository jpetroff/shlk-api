export default `
  type ShortlinkDescriptor {
    userTag: String
    descriptionTag: String
  }

  type SnoozeObject {
    awake: Long
    description: String
  }

  input QIShortlinkDescriptor {
    userTag: String
    descriptionTag: String
  }

  type Shortlink {
    _id: ID!
    hash: String!
    location: String!
    createdAt: String
    updatedAt: String
    descriptor: ShortlinkDescriptor
    owner: ID
    urlMetadata: Mixed
    siteTitle: String
    siteDescription: String
    snooze: SnoozeObject
    tags: [String]
    _searchIndex: String
  }

  input QIShortlink {
    hash: String!
    location: String!
    descriptor: QIShortlinkDescriptor
  }

  type Query {
    getShortlinkByHash(hash: String!): Shortlink
    getShortlinkByDescription(userTag: String, descriptionTag: String!): Shortlink
  }

  type Mutation {
    createShortlink( location: String! ): Shortlink
    createDescriptiveShortlink( location: String!, userTag: String, descriptionTag: String!, hash: String ): Shortlink
  }

  schema {
    query: Query
    mutation: Mutation
  }
`