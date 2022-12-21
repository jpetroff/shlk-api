import { graphqlHTTP } from 'express-graphql';
import graphqlSchema from '../graphql/schema'
import graphqlResolvers from '../graphql/resolvers'

export default graphqlHTTP({
	schema: graphqlSchema,
	rootValue: graphqlResolvers,
	graphiql: true,
})