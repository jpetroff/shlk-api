import { getUser, createOrUpdateUser, UserProfileFields } from '../../libs/auth-queries.db'
import * as _ from 'underscore'

export default {
  Query: {
    getLoggedInUser: async ( parent: any, args: void, context: any) : Promise<UserProfile | null> => {
      if(!context.req.session?.userId) return null

      const loggedUser : Maybe<UserDocument> = await getUser(context.req.session.userId)
      if(!loggedUser) return null

      const loggedProfile : UserProfile = _.pick(loggedUser, UserProfileFields)
      return loggedProfile
    }
  },

  Mutation: {
    updateLoggedInUser: async (parent: any, args: QIUser, context: any) : Promise<UserProfile | null> => {
      return null
    }
  }
}