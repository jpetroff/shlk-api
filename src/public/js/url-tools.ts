import _ from 'underscore'
import constants from './constants'
import config from './config.development'

interface DescriptiveShortlink {
	userTag?: string
	descriptionTag: string
}

class LinkTools {
	readonly baseUrl : string
	readonly displayServiceUrl : string

	constructor() {
		this.baseUrl = config.serviceUrl
		this.displayServiceUrl = config.displayServiceUrl
	}

	validateURL(str: string) : boolean {
		return constants.regexWeburl.test(str)
	}

	sanitizeURLSlug (str: string) : string {
		str = str.replace(/[^a-z0-9\s-]/ig, '')
		// str = str.replace(/\s+/ig, ' ').trim()
		str = str.replace(/\s/ig, '-')
		return str
	}

	generateShortlinkFromHash( hash: string ) : string {
		return `${this.baseUrl}/${hash}`
	}

	generateDescriptiveShortlink( { userTag, descriptionTag } : DescriptiveShortlink ) : string {
		const userTagPart = userTag ? userTag + '@' : ''
		return `${this.baseUrl}/${userTagPart}${descriptionTag}`
	}

	fixProtocol( url: string ) : string {
		if(this.validateURL(url)) return url

		const result = 'https://' + url.trim()
		if(this.validateURL(result)) return result

		throw new Error(`URL ${result} is not valid`)
	}
}

export default new LinkTools()