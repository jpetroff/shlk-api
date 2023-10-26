import mongoose from 'mongoose'
import * as config from '../config'
import { cliColors } from './utils.js'
import session from 'express-session'
import MongoDBSessionConstructor from 'connect-mongodb-session'

const mongoClusterUri = config.MONGO_FULL
  .replace('{{MONGO_USER}}', config.MONGO_USER)
  .replace('{{MONGO_PASSWORD}}', config.MONGO_PASSWORD)
  .replace('{{MONGO_DB}}', config.MONGO_DB)

export const appSessionSecret = config.APP_SESSION_SECRET

mongoose.set('strictQuery', false)
const options : mongoose.ConnectOptions = {}

export async function mongoConnect() {
  console.log(`[…] Connecting to ${cliColors.yellow}${config.MONGO_DB}${cliColors.end}: ${mongoClusterUri}`)
  return mongoose
    .connect(mongoClusterUri, options)
    .then( (result) => {
      console.log(`${cliColors.green}[✓]${cliColors.end} Connected to ${config.MONGO_DB}`)
    })
    .catch( (err) => {
      console.error(`${cliColors.red}[x]${cliColors.end} Connection error\n`)
      console.dir(err)
    })
}


const MongoDBCreateStore = MongoDBSessionConstructor(session)
export const MongoDBStore = new MongoDBCreateStore({
  uri: mongoClusterUri,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months in milliseconds
})