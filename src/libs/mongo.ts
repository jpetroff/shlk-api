import mongoose, { ConnectOptions } from "mongoose"
import connectorJSON from '../mongo_creds.json'

const mongoClusterUri = connectorJSON.MONGO_FULL
console.log(mongoClusterUri)
const options = { useNewUrlParser: true, useUnifiedTopology: true }

export const mongoConnectPromise =
mongoose
  .connect(mongoClusterUri, options as ConnectOptions)