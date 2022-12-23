import _ from 'underscore'
import { GraphQLClient, gql } from 'graphql-request'
import { validateLocation, AnyObject } from '../../js/_utils'

class GraphQLHomeQuery {
	private queryUrl : string

	private gqlClient : GraphQLClient

	constructor() {
		this.queryUrl = window.location.origin + '/api'
		this.gqlClient = new GraphQLClient(this.queryUrl, { headers: {} })
	}

	public async createShortlink (location: string) : Promise<AnyObject | null> {
		if (validateLocation(location) == false) {
			throw new Error(`Not a valid URL: '${location}'`)
		}
		const query = gql`
		mutation createShortlinkWithVars (
			$location: String!
		){
			createShortlink(location: $location) {
				hash
			}
		}
		`

		const response = await this.gqlClient.request(query, { location })
		console.log(response)
		return response.createShortlink

		/* const response = await axios({
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
		return response.data.data.createShortlink */
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
		return response.createDescriptiveShortlink
		
		/* const response = await axios({
			url: this.queryUrl,
			method: 'post',
			data: {query: `
					mutation {
						createDescriptiveShortlink(userTag: "${userTag}", descriptionTag: "${descriptionTag}", location: "${location}", hash: "${hash}") {
							hash
							location
							descriptor {
								userTag
								descriptionTag
							}
						}
					}
			`}
		})
		return response.data.data.createDescriptiveShortlink */
	}
}

export default new GraphQLHomeQuery()