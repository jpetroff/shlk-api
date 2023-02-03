/* eslint-disable no-useless-catch */
import Shortlink, { ShortlinkModel } from '../models/shortlink'
import { normalizeURL, sameOrNoOwnerID } from './utils'
import generateHash from './hash.lib'
import _ from 'underscore'
import { GraphQLError } from 'graphql' 
import User from '../models/user'
import fetchMetadata from 'url-metadata'

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
  location = normalizeURL(location)

  let user : Maybe<UserDocument> = null
  if(userId) {
    user = await User.findById(userId)
  }

  let tryFindShortlink : Maybe<ResultDoc<ShortlinkDocument>> = null
  let hash : string = _hash || generateHash()

  // for existing user checking if URL already exists
  if(user) {
    tryFindShortlink = await Shortlink.findOne({
      owner: user._id,
      location: location
    })

    // if URL already exists, return it to avoid creating 
    // duplicates in collection
    if(tryFindShortlink) return tryFindShortlink
  }

  // next check if Shortlink object with 
  // optionally provided hash exists already
  // (or in rare case randomly generated one duplicated existing)
  tryFindShortlink = await Shortlink.findOne({hash})

  // if hash, location and owner match
  // return existing to modify further
  if(
    tryFindShortlink && 
    tryFindShortlink.location == location &&
    sameOrNoOwnerID(tryFindShortlink.owner, user?._id)
  ) {
    return tryFindShortlink
  }

  // in any other case create a fresh Shortlink object
  // to modify or store further 
  let newShortlinkObject : ShortlinkDocument = {
    hash: tryFindShortlink ? generateHash() : hash,
    location,
  }

  if(user?._id) {
    const urlMetadata = await fetchMetadata(location)
    newShortlinkObject.owner = user._id
    newShortlinkObject.urlMetadata = urlMetadata
  }

  const newShortlink : ResultDoc<ShortlinkDocument> = new Shortlink(newShortlinkObject)
  return newShortlink
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
 *  @param {object} arguments {
 *  @param {string} location Full URL
 *  @param {string} descriptionTag Custom URL slug instead of random hash
 *  @param {string} userTag Full URL
 *  @param {string} hash Random 4-letter slug
 *  @param {string} userId owner user ID }
 * 
 *  @return {Promise<ShortlinkDocument | null>}
 */
export async function createShortlinkDescriptor( 
  args : { location: string, descriptionTag: string, hash?: string, userTag?: string, userId?: string }
): Promise<ShortlinkDocument | null> {
  try {
    args.location = normalizeURL(args.location)

    // If shortlink with args.userTag and args.descriptionTag exists
    // return it when location and owner id are the same 
    // otherwise cannot create this shortlink
    const existingShortlinkDescription : ResultDoc<ShortlinkDocument> | null = await Shortlink.findOne( 
      { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } } 
    )
    if (
      existingShortlinkDescription != null && 
      existingShortlinkDescription.location == args.location &&
      sameOrNoOwnerID(args.userId, existingShortlinkDescription.owner)
    ) {
      return existingShortlinkDescription.toObject()

    } else if (existingShortlinkDescription != null) {
      throw new GraphQLError(
        `Shortlink '/${args.userTag}@${args.descriptionTag}' already exists`, 
        { extensions: { code: 'DUPLICATING_DESCRIPTOR' } }
      )
    }

    // Shortlink with args.userTag and args.descriptionTag DOES NOT exist:
    // update existing one or create new and save()
    const shortlinkDocument = await createOrGetShortlink(
      args.location, args.userId, args.hash
    )

    shortlinkDocument.descriptor = {
      userTag: args.userTag,
      descriptionTag: args.descriptionTag
    }

    const resultShortlink = await shortlinkDocument.save()
    return resultShortlink.toObject()

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

