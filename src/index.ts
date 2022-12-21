import app from './libs/app'
import { mongoConnectPromise } from './libs/mongo' 

const port = process.env.PORT || 8002

mongoConnectPromise
	.then(
		() => app.start(port as number)
	)
	.catch( (error : any) => {
    throw error 
  })


