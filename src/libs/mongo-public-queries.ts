/* eslint-disable no-useless-catch */
import Shortlink, { ShortlinkDocument } from '../models/shortlink'
import { sanitizeMongo } from './utils'
import generateHash from './shortlink-hash'
import _ from 'underscore'

/**
 * Returns created shortlink or null: Promise<null | ShortlinkDocument>
 *
 * @param {string} location Full URL
 */
export async function createShortlink(location: string): Promise<null | ShortlinkDocument> {
	try {
		const shortlink = new Shortlink({
			hash: generateHash(),
			location: _.escape(location)
		})
		const newShortlink = await shortlink.save()
		return newShortlink
	} catch (error) {
		throw error
	}
}

/**
 * Creates or updates a shortlink with custom URL slug /{userTag}@{descriptionTag}
 * If shortlink already exists tries to update or throws error if duplicate is detected
 * Returns created shortlink or null: Promise<null | ShortlinkDocument> 
 *
 * @param {object} arguments {
 * 	@param {string} location Full URL
 * 	@param {string} descriptionTag Custom URL slug instead of random hash
 * 	@param {string} userTag Full URL
 * 	@param {string} hash Random 4-letter slug }
 */
export async function createShortlinkDescriptor( 
	args : { location: string, descriptionTag: string, hash?: string, userTag?: string }
): Promise<null | ShortlinkDocument> {
	args.location = _.escape(args.location)
	args.hash = sanitizeMongo(args.hash)
	args.userTag = sanitizeMongo(args.userTag)
	args.descriptionTag = sanitizeMongo(args.descriptionTag)

	const existingShortlinkDescription = await Shortlink.findOne( { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } } )
	try {
		if (existingShortlinkDescription != null && existingShortlinkDescription.location == args.location ) {
			return existingShortlinkDescription

		} else if (existingShortlinkDescription != null) {
			throw new Error(`Shortlink '${args.userTag}@${args.descriptionTag}' already exists`)

		} else if (args.hash != '') {
			const existingShortlinkHash = await getShortlink( { hash: args.hash } )
			if(existingShortlinkHash != null && existingShortlinkHash.location != args.location) {
				throw new Error(`Cannot update: Hash /${args.hash} is taken by another location '${args.location}'`)

			} else if (existingShortlinkHash == null) {
				const shortlink = new Shortlink({
					hash: args.hash,
					location: _.escape(args.location),
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
		throw error
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
	args.hash = sanitizeMongo(args.hash)
	args.userTag = sanitizeMongo(args.userTag)
	args.descriptionTag = sanitizeMongo(args.descriptionTag)
	try {
		if (args.hash) {
			const shortlink = await Shortlink.findOne( { hash: args.hash } )
			return shortlink
		} else if (args.descriptionTag) {
			const shortlink = await Shortlink.findOne( { descriptor: { userTag: args.userTag, descriptionTag: args.descriptionTag } } )
			console.log(shortlink)
			return shortlink
		} else {
			return null
		}
	} catch(error) {
		throw error
	}
}
