import { getUser, createOrUpdateUser, UserProfileFields } from '../../libs/user.queries'
import { queryShortlinks, setAwakeTimer } from '../../libs/shortlink.queries'
import { authUserId } from '../../libs/auth.helpers'
import { GraphQLError } from 'graphql'
import * as _ from 'underscore'
import { resolve } from 'path'
import { resolveError } from '../extends'
import { LeanDocument } from 'mongoose'

export default {
  Query: {
    getLoggedInUser: async ( parent: any, args: void, context: any) : Promise<UserProfile | null> => {
      try {
        const userId = context?.req?.session?.userId

        const loggedUser : Maybe<ResultDoc<UserDocument>> = await getUser(userId)
        if(!loggedUser) return null

        const loggedProfile : UserProfile = _.pick(loggedUser.toObject(), UserProfileFields)
        return loggedProfile
      } catch(error : any) {
        if(error instanceof GraphQLError) { throw error } 
        else {
          throw new GraphQLError(
            error.message || String(error), 
            { extensions: error.meta || { code: 'UNKNOWN_ERROR' } }
          )
        }
      }
    },

    getUserShortlinks: async ( parent: any, argsObj: { args: QICommon }, context: any) : Promise<ShortlinkDocument[]> => {
      try {
        const userId = authUserId(context?.req)
        const queryArgs = _.extendOwn({ userId: userId }, argsObj.args)
        const shortlinkList = await queryShortlinks(queryArgs)
        return shortlinkList
      } catch(error : any) {
        throw resolveError(error)
      }
    }
  },

  Mutation: {
    updateLoggedInUser: async (parent: any, args: QIUser, context: any) : Promise<UserProfile | null> => {
      return null
    },

    createOrUpdateShortlinkTimer: async (parent: any, { args }: {args: QISnoozeTimer}, context: any) : Promise<ShortlinkDocument | null> => {
      const userId = context?.req?.session?.userId
      const shortlink = await setAwakeTimer( {
        userId: userId,
        ...args
      })
      if(!shortlink) return null
      return shortlink.toObject()
    }
  }
}