import mongoose from "mongoose"
import mongoAuth from '../mongo_creds.js'
import { cliColors } from "./utils.js"

const mongoClusterUri = mongoAuth.MONGO_FULL
  .replace('{{MONGO_USER}}', mongoAuth.MONGO_USER)
  .replace('{{MONGO_PASSWORD}}', mongoAuth.MONGO_PASSWORD)
  .replace('{{MONGO_DB}}', mongoAuth.MONGO_DB)

mongoose.set('strictQuery', false)
const options : mongoose.ConnectOptions = {}


export async function mongoConnect() {
  console.log(`[…] Connecting to ${cliColors.yellow}${mongoAuth.MONGO_DB}${cliColors.end}: ${mongoClusterUri}`)
  return mongoose
    .connect(mongoClusterUri, options)
    .then( (result) => {
      console.log(`${cliColors.green}[✓]${cliColors.end} Connected to ${mongoAuth.MONGO_DB}`)
    })
    .catch( (err) => {
      console.error(`${cliColors.red}[×]${cliColors.end} Connection error\n`)
      console.dir(err)
    })
}