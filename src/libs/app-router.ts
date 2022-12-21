import express from 'express'
import path from 'path'
import { getShortlink } from './mongo-public-queries'
import { sendDescriptiveRedirect, sendRedirect, sendErrorResponse } from './server-public-pages'
import { sanitizeMongo } from './utils'

const appRouter = express.Router()
const publicDir = path.join(__dirname, '../public')

appRouter.get('/api/ping', (req, res) => {
	res.json({ 
		message: 'Hello World!'
	})
})

appRouter.get('/', (req, res) => {
	res.sendFile(path.join(publicDir, 'index.html'));
})

appRouter.get('/:redirectUrl', (req, res) => {
	const isDecriptiveUrl = /.*?@.*?/.test(req.params.redirectUrl)

	if(isDecriptiveUrl) {
		const [ userTag , descriptionTag ] = req.params.redirectUrl.split('@')
		getShortlink({
			userTag: sanitizeMongo(userTag),
			descriptionTag: sanitizeMongo(descriptionTag)
		}).then( (result) => {
			if(!result) throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`)
			return sendDescriptiveRedirect(res, result)
		}).catch( (err) => {
			return sendErrorResponse(res, err)
		}) 

	} else {
		const hash = sanitizeMongo(req.params.redirectUrl)
		getShortlink({
			hash
		}).then( (result) => {
			if(!result) throw new Error(`Shortlink '/${req.params.redirectUrl}' not found`)
			return sendRedirect(res, result)
		}).catch( (err) => {
			return sendErrorResponse(res, err)
		})

	}
})

const staticRoute = express.static(publicDir)

export {appRouter, staticRoute}