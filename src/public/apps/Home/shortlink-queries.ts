import axios from 'axios'
import { validateLocation, AnyObject } from '../../js/_utils'

class GraphQLHomeQuery {
	private queryUrl : string

	constructor() {
		this.queryUrl = window.location.origin + '/api'
	}

	public async createShortlink (location: string) : Promise<AnyObject | null> {
		if (validateLocation(location) == false) {
			throw new Error(`Not a valid URL: '${location}'`)
		}
		const response = await axios({
				url: this.queryUrl,
				method: 'post',
				data: {query: `
						mutation {
							createShortlink(location: "${location}") {
								hash
							}
						}
				`}
		})
		return response.data.data.createShortlink
	}
}

export default new GraphQLHomeQuery()