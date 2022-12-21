import app from './libs/app'
import { mongoConnectPromise } from './libs/mongo' 
import mongoCreds from './mongo_creds.json'

const port = (process.env.PORT || 8002)

mongoConnectPromise
	.then( () => {
			app.start(port as number)
		}
	)
	.catch( (error) => {
    throw error 
  })


