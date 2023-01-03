import _ from 'underscore'

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
		if (!window.localStorage) return false
		const urlKey = _.escape(args.url)
		const storageItem : ShortlinkLocalStorage = {
			...args,
			createdAt: (new Date()).toISOString()
		}
		try {
			window.localStorage.setItem(urlKey, JSON.stringify(storageItem))
		} catch { return false }
		return true
	}

	public checkShortlinkCache( args: ShortlinkLocal) : ShortlinkLocalStorage | null {
		if (!window.localStorage) return null

		const urlKey = _.escape(args.url)
		const existingShortlink = window.localStorage.getItem(urlKey)
		if(existingShortlink != null) {
			return JSON.parse(existingShortlink)
		} else {
			return null
		}
	}
}

export default new LocalStorageLinkCache()