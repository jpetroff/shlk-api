import mongoose, { Schema } from 'mongoose'
import mongooseValidation from 'mongoose-beautiful-unique-validation'

export type BanItem = {
	value: string
	type: 'IP' | 'user' | 'location'
}

export interface BanDocument extends BanItem {
  _id: ObjectId
  createdAt?: string
  updatedAt?: string
}

export type BanModel = typeof mongoose.Model<BanItem>

const banlistSchema = new Schema<BanDocument, BanModel>(
  {
    value: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: true
    }

  },
  { timestamps: true }
)

banlistSchema.plugin(mongooseValidation)

export default mongoose.model<BanDocument, BanModel>("Banlist", banlistSchema)