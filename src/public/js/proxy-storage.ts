import * as _ from 'underscore'

export const proxyStorage = {

	async getItem(key : string) : Promise<string | null> {
		const result = window.localStorage.getItem(key)
		return result || null
	},

	async setItem(key: string, value: string) : Promise<void> {
		window.localStorage.setItem(key, value)
	},

	canUse() {
		if(window.localStorage) return true
		return false
	}

}

export default proxyStorage