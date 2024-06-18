/* eslint-disable no-useless-catch */
import Banlist, { BanDocument, BanModel, BanItem } from '../models/banlist'
import _ from 'underscore'
import { ExtError } from './utils'

/**
 * Checks value agains banlist
 * throws error if found
 *
 * @param {string} value 
 * @param {string} type <'user' | 'IP' | 'location'>
 * 
 * @return {void 0}
 */
export async function checkBanlist(_value: string, type: 'user' | 'IP' | 'location', useReject: boolean = false) {
	let banlist: Maybe<BanDocument[]> = await Banlist.find({type})
	const value = _value.trim()
	const banvalues : string[] = _.map(banlist, (banitem) => banitem.value)

	let hasItem = false

	if(
		type == 'location'
	) {
		hasItem = _.reduce(
			banvalues, 
			(result, _banvalue) => {
				const banvalue = _banvalue.trim()
				if(banvalue[0] == '/' && banvalue[banvalue.length - 1] == '/') {
					return result || (new RegExp(banvalue.replaceAll('/', '')).test(value))
				} else {
					return result || (banvalue == value)
				}
			},
			hasItem 
		)
	} else {
		hasItem = _.reduce(
			banvalues,
			(result, _banvalue) => {
				const banvalue = _banvalue.trim()
				return result || (banvalue == value)
			},
			hasItem
		)
	}

	if (hasItem && !useReject) 
		throw(new ExtError(
			`Sorry, this action is forbidden`,
			{
				code: 'BANNED'
			}
		))

	if(hasItem && useReject) 
		return Promise.reject(new ExtError(
			`Sorry, this action is forbidden`,
			{
				code: 'BANNED'
			}
		))
}