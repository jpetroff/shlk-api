import express from 'express'
import path from 'path'

const appRouter = express.Router()

appRouter.get('/api/ping', (req, res) => {
	res.json({ 
		message: 'Hello World!'
	})
})

appRouter.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
})

const staticRoute = express.static(path.join(__dirname, 'public'))

export {appRouter, staticRoute}