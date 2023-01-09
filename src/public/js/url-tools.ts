import * as _ from 'underscore'
import constants from './constants'
const config = require('./config')

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
		const userTagPart = userTag ? userTag : ''
		const descriptionTagPart = '@' + descriptionTag
		return `${this.baseUrl}/${userTagPart}${descriptionTagPart}`
	}

	fixProtocol( url: string ) : string {
		if(this.validateURL(url)) return url

		const result = 'https://' + url.trim()
		if(this.validateURL(result)) return result

		throw new Error(`URL ${result} is not valid`)
	}

	/* 
		For query array [ 'param1', 'param2', ... ]
		Returns corresponding query values or null [ 'value1', null, ...  ]
	 */
	queryUrlSearchParams(queryParam: string[], searchParamsString?: string) : Array<string | null> {
		if(!searchParamsString) return Array.from({length: _.size(queryParam)}, () => null)

		const searchParams = new URLSearchParams(searchParamsString)
		let result : Array<string | null> = []
		_.forEach(queryParam, (param) => {
			result.push(searchParams.get(param))
		})
		_.map(result, (item) => {
			if(item != null) return decodeURIComponent(item)
		})
		return result 
	}
}

export default new LinkTools()