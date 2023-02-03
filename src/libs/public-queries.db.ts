/* eslint-disable no-useless-catch */
import Shortlink, { ShortlinkModel } from '../models/shortlink'
import { allEmpty, prepareURL } from './utils'
import generateHash from './hash.lib'
import _ from 'underscore'
import { GraphQLError } from 'graphql' 
import User from '../models/user'

/**
 * Returns new or existing Shortlink mongoose document
 * to modify or save() later
 *
 * @param {string} location Full URL
 * @param {string} hash (optional) Shortlink hash to check if it exists
 * @param {string} userId (oprional) current logged user ID from session to attach owner to created shortlink
 * 
 * @return {Promise<ResultDocument<ShortlinkDocument>>}
 */
async function createOrGetShortlink(location: string, userId?: Maybe<string>, _hash?: Maybe<string>) : Promise<ResultDoc<ShortlinkDocument>> {
  // normalise location first
  location = prepareURL(location)

  let user : Maybe<UserDocument> = null
  if(userId) {
    user = await User.findById(userId)
  }

  let hash : string = _hash || generateHash()
  const tryFindShortlink : Maybe<ResultDoc<ShortlinkDocument>> = await Shortlink.findOne({hash})

  if(
    tryFindShortlink && 
    tryFindShortlink.location == location &&
    (allEmpty(userId, user?._id.toString()) || userId == user?._id.toString())
  ) {
    return tryFindShortlink
  }
  
  const shortlink : ResultDoc<ShortlinkDocument> = new Shortlink({
    hash: generateHash(),
    location: prepareURL(location),
    owner: user?._id || undefined
  })

  return shortlink
}


/**
 * Returns created shortlink or null
 *
 * @param {string} location Full URL
 * @param {string} userId (oprional) current logged user ID from session to attach owner to created shortlink
 * 
 * @return {Promise<ShortlinkDocument | null>}
 */
export async function createShortlink(location: string, userId?: Maybe<string>): Promise<ShortlinkDocument | null> {
  try {
    const resultShortlinkDocument = await createOrGetShortlink(location, userId)
    const newShortlink = await resultShortlinkDocument.save()
    return newShortlink.toObject()

  } catch (error) {
    if(error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: { code: 'OTHER_MONGO_ERROR' }
      })
    } else {
      throw new GraphQLError(String(error), {
        extensions: { code: 'UNKNOWN_ERROR' }
      })
    }
  }
}

/**
 * Creates or updates a shortlink with custom URL slug /{userTag}@{descriptionTag}
 * If shortlink already exists tries to update or throws error if duplicate is detected
 * Returns created shortlink or null 
 *
 * 	@param {object} arguments {
 * 	@param {string} location Full URL
 * 	@param {string} descriptionTag Custom URL slug instead of random hash
 * 	@param {string} userTag Full URL
 * 	@param {string} hash Random 4-letter slug }
 * 
 * @return {Promise<null | ShortlinkDocument>}
 */
export async function createShortlinkDescriptor( 
  args : { location: string, descriptionTag: string, hash?: string, userTag?: string }
): Promise<null | ShortlinkDocument> {

  const existingShortlinkDescription = await Shortlink.findOne( { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } } )
  try {
    if (existingShortlinkDescription != null && existingShortlinkDescription.location == args.location ) {
      return existingShortlinkDescription

    } else if (existingShortlinkDescription != null) {
      throw new GraphQLError(`Shortlink '${args.userTag}@${args.descriptionTag}' already exists`, {
        extensions: {  code: 'DUPLICATING_DESCRIPTOR'  }
      })

    } else if (args.hash && !_.isEmpty(args.hash)) {
      const existingShortlinkHash = await getShortlink( { hash: args.hash } )
      if(existingShortlinkHash != null && existingShortlinkHash.location != args.location) {
        throw new GraphQLError(`Cannot update: Hash /${args.hash} is taken by another location '${args.location}'`, {
          extensions: {  code: 'DUPLICATING_HASH'  }
        })

      } else if (existingShortlinkHash == null) {
        const shortlink = new Shortlink({
          hash: args.hash,
          location: args.location,
          descriptor: {
            userTag: args.userTag,
            descriptionTag: args.descriptionTag
          }
        })
        const newShortlink = await shortlink.save() 
        return newShortlink

      } else {
        const update = await Shortlink.findOneAndUpdate( 
          {
            hash: args.hash
          },
          {
            descriptor: {
              userTag: args.userTag,
              descriptionTag: args.descriptionTag
            }
          }
        )
        const updatedShortlink = await Shortlink.findById(update._id)
        return updatedShortlink
      }

    } else {
      const shortlink = new Shortlink({
        hash: generateHash(),
        location: args.location,
        descriptor: {
          userTag: args.userTag,
          descriptionTag: args.descriptionTag
        }
      })
      const newShortlink = await shortlink.save() 
      return newShortlink
    }
  } catch (error) {
    if(error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: {  code: 'OTHER_MONGO_ERROR'  }
      })
    } else {
      throw new GraphQLError(String(error), {
        extensions: { code: 'UNKNOWN_ERROR' }
      })
    }
  }
}

/**
 * Returns one existing shortlink or null: Promise<null | ShortlinkDocument> 
 * Requires either hash or descriptionTag to find a shortlink
 *
 * @param {object} arguments {
 * 	@param {string} location Full URL
 * 	@param {string} descriptionTag Custom URL slug instead of random hash
 * 	@param {string} userTag Full URL
 * 	@param {string} hash Random 4-letter slug }
 */
export async function getShortlink( args: {hash?: string, userTag?: string, descriptionTag: string}): Promise<ShortlinkDocument | null>;
export async function getShortlink(	args: {hash: string} ): Promise<ShortlinkDocument | null> 
export async function getShortlink(	args: {hash?: string, userTag?: string, descriptionTag?: string} ): Promise<ShortlinkDocument | null> {

  try {
    if (args.hash) {
      const shortlink = await Shortlink.findOne( { hash: args.hash } )
      return shortlink
    } else if (args.descriptionTag) {
      const shortlink = await Shortlink.findOne( { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } } )
      return shortlink
    } else {
      return null
    }
  } catch(error) {
    if(error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: { code: 'OTHER_MONGO_ERROR' }
      })
    } else {
      throw new GraphQLError(String(error), {
        extensions: { code: 'UNKNOWN_ERROR' }
      })
    }
  }
}

