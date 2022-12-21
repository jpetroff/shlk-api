import mongoose from 'mongoose'
import mongooseValidation from 'mongoose-beautiful-unique-validation'

/*
GraphQL interface for arguments and request
*/
export interface QIShortlink {
	hash: string;
	location: string;
	descriptor?: {
		userTag?: string;
		descriptionTag: string; 
	}
}

/* 
	MongoDB object representation for query results
	*/
export interface ShortlinkDocument extends QIShortlink {
	_id?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type ShortlinkModel = typeof mongoose.Model<ShortlinkDocument>

const Schema = mongoose.Schema

const shortlinkSchema = new Schema<ShortlinkDocument, ShortlinkModel>(
  {
    hash: {
      type: String,
      required: true,
      unique: true
    },

    location: {
      type: String,
      required: true,
    },

    descriptor: {
      userTag: { type: String },
      descriptionTag: { type: String }
    }
  },
  { timestamps: true }
)

shortlinkSchema.plugin(mongooseValidation)

export default mongoose.model<ShortlinkDocument, ShortlinkModel>("Shortlink", shortlinkSchema)