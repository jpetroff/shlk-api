import * as _ from 'underscore'
import proxyStorage from './proxy-storage'

export type ShortlinkLocal = {
	hash?: string,
	url: string,
	userTag?: string,
	descriptionTag?: string
}

export type ShortlinkLocalStorage = ShortlinkLocal & {
	createdAt: string
}

class LocalStorageLinkCache {

	public storeShortlink( args: ShortlinkLocal) : boolean {
		if (!proxyStorage.canUse()) return false

		const urlKey = encodeURI(args.url)
		const storageItem : ShortlinkLocalStorage = {
			...args,
			createdAt: (new Date()).toISOString()
		}
		proxyStorage.setItem(urlKey, JSON.stringify(storageItem)).catch((err) => {console.error(err)})
		return true
	}

	public async checkShortlinkCache( args: ShortlinkLocal) : Promise<ShortlinkLocalStorage | null> {
		if (!proxyStorage.canUse()) return null

		const urlKey = encodeURI(args.url)
		const existingShortlink = await proxyStorage.getItem(urlKey)
		if(existingShortlink != null) {
			return JSON.parse(existingShortlink)
		} else {
			return null
		}
	}

	public async getAll(args: {
		sortByDate?: boolean
		clearThreshold?: Date,
		limit?: number
	}) : Promise<ShortlinkLocalStorage[] | null> {
		const storageContent = await proxyStorage.getAllItems(true)
		if(!storageContent) return null
		let result : ShortlinkLocalStorage[] = []
		_.each(storageContent, (item) => {
			if(
				_.isObject(item) && 
				!_.isEmpty(item) && 
				_.keys(item).includes('url')
			) {
				result.push(item as ShortlinkLocalStorage)
			}
		})

		if(args.sortByDate) {
			result = _.sortBy(result, (item) => {
				return Date.now() - (new Date(item.createdAt)).valueOf()
			})
		}
		if(args.clearThreshold) {
			const cmpValue = new Date(args.clearThreshold).valueOf()
			result = _.reject(result, (item) => {
				return new Date(item.createdAt).valueOf() < cmpValue
			})
		}
		if(args.limit) return _.first(result, args.limit)
		return result
	}
}

export default new LocalStorageLinkCache()