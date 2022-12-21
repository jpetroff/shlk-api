import mongoose, { ConnectOptions } from "mongoose"
import connectorJSON from '../mongo_creds.json'

const mongoClusterUri = connectorJSON.MONGO_FULL
  .replace('{{MONGO_USER}}', connectorJSON.MONGO_USER)
  .replace('{{MONGO_PASSWORD}}', connectorJSON.MONGO_PASSWORD)
  .replace('{{MONGO_DB}}', connectorJSON.MONGO_DB)

console.log(mongoClusterUri)
const options = { useNewUrlParser: true, useUnifiedTopology: true }

export const mongoConnectPromise =
mongoose
  .connect(mongoClusterUri, options as ConnectOptions)