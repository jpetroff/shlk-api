/* eslint-disable no-useless-catch */
import { 
	createShortlink, 
	createShortlinkDescriptor,
	getShortlink
} from '../../libs/mongo-public-queries'

export default {
	Mutation: {
		createShortlink: ( parent : any, args : { location: string } ) => {
			return createShortlink(args.location)
		},
	
		createDescriptiveShortlink: ( parent : any, args: {location: string, userTag?: string, descriptionTag: string, hash?: string } ) => {
			return createShortlinkDescriptor(args)
		}
	},

	Query: {
		getShortlinkByHash: ( parent : any, args: { hash: string } ) => {
			return getShortlink(args)
		},
	
		getShortlinkByDescription: ( parent : any, args: { userTag?: string, descriptionTag: string } ) => {
			return getShortlink(args)
		}
	}
}