/* eslint-disable no-useless-catch */
import { 
	createShortlink, 
	createShortlinkDescriptor,
	getShortlink
} from '../../libs/mongo-public-queries'

export default {

	// shortlinks: async () => {
  //   try {
  //     const shortlinksFetched = await Shortlink.find()
  //     return shortlinksFetched.map(
	// 			(shortlink: ShortlinkDocument) => {
  //         return shortlink
  //       })
  //   } catch (error) {
  //     throw error
  //   }
  // },

  createShortlink: async (args : { location: string } ) => {
    return createShortlink(args.location)
	},

	createDescriptiveShortlink: async (args: {location: string, userTag?: string, descriptionTag: string, hash?: string } ) => {
		return createShortlinkDescriptor(args)
	},

	getShortlinkByHash: async ( args: { hash: string } ) => {
		return getShortlink(args)
	},

	getShortlinkByDescription: async ( args: { userTag?: string, descriptionTag: string } ) => {
		return getShortlink(args)
	}
}