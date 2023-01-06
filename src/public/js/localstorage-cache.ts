import _ from 'underscore'
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

		const urlKey = _.escape(args.url)
		const storageItem : ShortlinkLocalStorage = {
			...args,
			createdAt: (new Date()).toISOString()
		}
		proxyStorage.setItem(urlKey, JSON.stringify(storageItem)).catch((err) => {console.error(err)})
		return true
	}

	public async checkShortlinkCache( args: ShortlinkLocal) : Promise<ShortlinkLocalStorage | null> {
		if (!proxyStorage.canUse()) return null

		const urlKey = _.escape(args.url)
		const existingShortlink = await proxyStorage.getItem(urlKey)
		if(existingShortlink != null) {
			return JSON.parse(existingShortlink)
		} else {
			return null
		}
	}
}

export default new LocalStorageLinkCache()