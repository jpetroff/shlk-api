// For later use when more schemas are added
// import { mergeResolvers } from '@graphql-tools/merge'

import typeDefsPublic from './schema/public-schema'
import resolversPublic from './resolvers/public-resolvers'
import { makeExecutableSchema } from '@graphql-tools/schema'

const schema = makeExecutableSchema({
	typeDefs: typeDefsPublic,
	resolvers: resolversPublic
})

export default schema