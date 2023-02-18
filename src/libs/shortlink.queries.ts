/* eslint-disable no-useless-catch */
import { LeanDocument, QueryWithHelpers, SortOrder } from 'mongoose'
import _ from 'underscore'
import Shortlink from '../models/shortlink'
import User from '../models/user'
import generateHash from './hash.lib'
import fetchMetadata, { URLMeta } from './url-parser.lib'
import { ExtError, normalizeURL, sameOrNoOwnerID } from './utils'
import SnoozeTools, { StandardTimers, SnoozeDay, SnoozeTime } from '../libs/snooze.tools'

export const ShortlinkPublicFields: (keyof ShortlinkDocument)[] = ['hash', 'descriptor', 'location', 'urlMetadata']

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
async function createOrGetShortlink(location: string, userId?: Maybe<string>, _hash?: Maybe<string>): Promise<ResultDoc<ShortlinkDocument>> {
  // normalise location first
  location = normalizeURL(location)

  let user: Maybe<UserDocument> = null
  if (userId) {
    user = await User.findById(userId)
  }

  let tryFindShortlink: Maybe<ResultDoc<ShortlinkDocument>> = null
  let hash: string = _hash || generateHash()

  // for existing user checking if URL already exists
  if (user) {
    tryFindShortlink = await Shortlink.findOne({
      owner: user._id,
      location: location
    })

    // if URL already exists, return it to avoid creating 
    // duplicates in collection
    if (tryFindShortlink) return tryFindShortlink
  }

  // next check if Shortlink object with 
  // optionally provided hash exists already
  // (or in rare case randomly generated one duplicated existing)
  tryFindShortlink = await Shortlink.findOne({ hash })

  // if hash, location and owner match
  // return existing to modify further
  if (
    tryFindShortlink &&
    tryFindShortlink.location == location &&
    sameOrNoOwnerID(tryFindShortlink.owner, user?._id)
  ) {
    return tryFindShortlink
  }

  // in any other case create a fresh Shortlink object
  // to modify or store further 
  let newShortlinkObject: ShortlinkDocument = {
    hash: tryFindShortlink ? generateHash() : hash,
    location,
  }

  if (user?._id) {
    newShortlinkObject.owner = user._id
  }

  const newShortlink: ResultDoc<ShortlinkDocument> = new Shortlink(newShortlinkObject)

  if (user?._id)
    _.delay(async () => {
      let urlMetadata: Maybe<URLMeta.Result> = undefined
      let siteTitle: string, siteDescription: string
      [urlMetadata, siteTitle, siteDescription] = await fetchMetadata(location)
      newShortlink.urlMetadata = urlMetadata
      newShortlink.siteTitle = siteTitle
      newShortlink.siteDescription = siteDescription
      newShortlink._searchIndex = `${newShortlink.location}|${newShortlink.descriptor?.descriptionTag || ''}|${newShortlink.siteTitle}|${newShortlink.siteDescription}`
      newShortlink.save()
    }, 100)
  return newShortlink
}


/**
 * Returns created shortlink or null
 *
 * @param {string} location Full URL
 * @param {string} userId (oprional) current logged user ID from session to attach owner to created shortlink
 * 
 * @return {Promise<ResultDoc<ShortlinkDocument> | null>} 
 */
export async function createShortlink(location: string, userId?: Maybe<string>): Promise<ResultDoc<ShortlinkDocument> | null> {
  const resultShortlinkDocument = await createOrGetShortlink(location, userId)
  const newShortlink = await resultShortlinkDocument.save()
  return newShortlink.toObject()
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
 *  @return {Promise<ResultDoc<ShortlinkDocument> | null>}
 */
export async function createShortlinkDescriptor(
  args: { location: string, descriptionTag: string, hash?: string, userTag?: string, userId?: string }
): Promise<ResultDoc<ShortlinkDocument> | null> {
  args.location = normalizeURL(args.location)

  // If shortlink with args.userTag and args.descriptionTag exists
  // return it when location and owner id are the same 
  // otherwise cannot create this shortlink
  const existingShortlinkDescription: ResultDoc<ShortlinkDocument> | null = await Shortlink.findOne(
    { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } }
  )
  if (
    existingShortlinkDescription != null &&
    existingShortlinkDescription.location == args.location &&
    sameOrNoOwnerID(args.userId, existingShortlinkDescription.owner)
  ) {
    return existingShortlinkDescription.toObject()

  } else if (existingShortlinkDescription != null) {
      throw new ExtError(
        `Shortlink '/${args.userTag}@${args.descriptionTag}' already exists`,
        { code: 'DUPLICATING_DESCRIPTOR' }
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

  shortlinkDocument._searchIndex = `${shortlinkDocument.location}|${shortlinkDocument.descriptor?.descriptionTag || ''}|${shortlinkDocument.siteTitle}|${shortlinkDocument.siteDescription}`

  const resultShortlink = await shortlinkDocument.save()
  return resultShortlink.toObject()
}

/**
 * Returns one existing shortlink or null: Promise<null | ShortlinkDocument> 
 * Requires either hash or descriptionTag to find a shortlink
 *
 * @param {object} arguments {
 * 	@param {string} location Full URL
 * 	@param {string} descriptionTag Custom URL slug instead of random hash
 * 	@param {string} userTag Full URL
 * 	@param {string} hash Random 4-letter slug 
 * }
 * 
 * @return {Promise<ResultDoc<ShortlinkDocument> | null>}
 */
export async function getShortlink(args: { hash?: string, userTag?: string, descriptionTag: string }): Promise<ResultDoc<ShortlinkDocument> | null>;
export async function getShortlink(args: { hash: string }): Promise<ResultDoc<ShortlinkDocument> | null>
export async function getShortlink(args: { hash?: string, userTag?: string, descriptionTag?: string }): Promise<ResultDoc<ShortlinkDocument> | null> {
  if (args.hash) {
    const shortlink = await Shortlink.findOne({ hash: args.hash })
    return shortlink
  } else if (args.descriptionTag) {
    const shortlink = await Shortlink.findOne({ descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } })
    return shortlink
  } else {
    return null
  }
}


/**
 * Returns list of shortlink documents for userId : Promise<(ResultDoc<ShortlinkDocument>)[]>\
 * Uses .lean() to execute, so returned objects are plain JS objects
 *
 * @param {object} arguments {
 *  * @param {number} limit
 * }
 * 
 * @return {Promise<(ResultDoc<ShortlinkDocument>)[]>}
 */
export async function queryShortlinks(
  args: { userId: string } & QICommon
): Promise<(LeanDocument<ShortlinkDocument>)[]> {
  let results: QueryWithHelpers<LeanDocument<ShortlinkDocument>[], LeanDocument<ShortlinkDocument>>

  results = Shortlink.find<ShortlinkDocument>({
    owner: args.userId
  })

  if (args.search) {
    const _s = args.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    results.find(
      { _searchIndex: { $regex: new RegExp(_s, 'i') } }
    )
  }

  if (args.sort && args.order) {
    results.sort([[args.sort, args.order as SortOrder]])
  } else {
    results.sort([['updatedAt', 'desc']])
  }
  if (args.skip) results.skip(args.skip)
  if (args.limit) results.limit(args.limit)

  const resultArray = await results.lean()

  return resultArray
}

/* 
  Set awake timer for shortlink
*/
export async function setAwakeTimer( 
  args: {
    userId: string
    location?: string
    hash?: string
    id?: string
    standardTimer?: StandardTimers
    customDay?: SnoozeDay
    customTime?: SnoozeTime
  }
) : Promise<ResultDoc<ShortlinkDocument> | null> {
  if(!args.userId) return null
  
  let shortlinkDoc : ResultDoc<ShortlinkDocument> | null = null
  if(args.id) {
    try {
      shortlinkDoc = await Shortlink.findById(args.id)
      if(shortlinkDoc?.owner?.toString() != args.userId) throw new Error('Shortlink belongs to another user and cannot be modified')
    } catch(err : any) {
      throw new ExtError(
        err.message,
        { code: 'SNOOZE_MODIFY_ERROR' }
      )
    }
  } else if(args.location) {
    shortlinkDoc = await createOrGetShortlink(args.location, args.userId, args.hash)
  }

  if(!shortlinkDoc) return null

  if(args.standardTimer) {
    shortlinkDoc.snooze = {
      awake: SnoozeTools.getStandardSnooze( args.standardTimer ).valueOf(),
      description: SnoozeTools.getStandardDescription( args.standardTimer )
    } 
  } else if(args.customDay && args.customTime) {
    shortlinkDoc.snooze = {
      awake: SnoozeTools.getCustomSnooze(args.customDay, args.customTime).valueOf(),
      description: ''
    }
  }

  await shortlinkDoc.save()
  return shortlinkDoc
}