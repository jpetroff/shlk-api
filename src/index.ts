import app from './libs/app'
import { mongoConnect } from './libs/connect.db' 
import { cliColors } from './libs/utils'

const port = parseInt(process.env.PORT || '8002')

async function main () {
  console.log(`\n\n[…] shlk.cc app starting in ${cliColors.yellow}${process.env.NODE_ENV}${cliColors.end} mode`)

  const mongoose = await mongoConnect()
  app.start(port)
}

main().catch( (err) => console.error(err) )


