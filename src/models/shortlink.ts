import mongoose, { Schema } from 'mongoose'
import mongooseValidation from 'mongoose-beautiful-unique-validation'


export type ShortlinkModel = typeof mongoose.Model<ShortlinkDocument>

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
    },

    owner: {
      type: Schema.Types.ObjectId,
      index: true,
      required: false
    }
  },
  { timestamps: true }
)

shortlinkSchema.plugin(mongooseValidation)

export default mongoose.model<ShortlinkDocument, ShortlinkModel>("Shortlink", shortlinkSchema)