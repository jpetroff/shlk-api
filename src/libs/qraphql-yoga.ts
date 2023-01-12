import schema from '../graphql'

import { createYoga, createSchema } from 'graphql-yoga'
import { useDisableIntrospection } from '@graphql-yoga/plugin-disable-introspection'

const yogaServer = createYoga({
	schema,
	graphiql: process.env.NODE_ENV == 'development' ? true : false,
  plugins: process.env.NODE_ENV == 'development' ? [] : [useDisableIntrospection()],
	graphqlEndpoint: '/api'
})

export default yogaServer