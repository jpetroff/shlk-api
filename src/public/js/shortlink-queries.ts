import _ from 'underscore'
import { GraphQLClient, gql } from 'graphql-request'
import { validateURL } from './utils'
import { AnyObject } from './constants'
import config from './config.development'

class GraphQLHomeQuery {
	private queryUrl : string

	private gqlClient : GraphQLClient

	constructor() {
		this.queryUrl = config.serviceUrl + '/api'
		this.gqlClient = new GraphQLClient(this.queryUrl, { headers: {} })
	}

	public async createShortlink (location: string) : Promise<AnyObject | null> {
		if (validateURL(location) == false) {
			throw new Error(`Not a valid URL: '${location}'`)
		}
		const query = gql`
		mutation createShortlinkWithVars (
			$location: String!
		){
			createShortlink(location: $location) {
				hash
				location
			}
		}
		`

		const response = await this.gqlClient.request(query, { location })
		console.log('[GQL] createShortlink\n', response)
		return response.createShortlink
	}

	public async createShortlinkDescriptor (
		{ userTag, descriptionTag, location, hash } : { userTag?: string, descriptionTag: string, location: string, hash?: string }
	) : Promise<AnyObject | null> {
		if(_.isEmpty(descriptionTag) || _.isEmpty(location)) return null

		const query = gql`
		mutation createDescriptiveShortlinkWithVars(
			$userTag: String
			$descriptionTag: String!
			$location: String!
			$hash: String
		) {
			createDescriptiveShortlink(userTag: $userTag, descriptionTag: $descriptionTag, location: $location, hash: $hash) {
				hash
				location
				descriptor {
					userTag
					descriptionTag
				}
			}
		}
		`

		const response = await this.gqlClient.request(query, { userTag, descriptionTag, location, hash })
		console.log('[GQL] createShortlinkDescriptor\n', response)
		return response.createDescriptiveShortlink
	}
}

export default new GraphQLHomeQuery()