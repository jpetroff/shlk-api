import express from 'express'
import path from 'path'
import { appRedirect } from './app.controllers'

const appRouter = express.Router()
const publicDir = process.env.NODE_ENV == 'production' ? 
  path.join(__dirname, '../public') : 
  path.join(__dirname, '../../../shlk-app/dist')

const indexPath = path.join(publicDir, 'index.html')

/* frontend routes */
appRouter.get(['/', '/app', '/app/*', '/login', '/privacy-policy'], (req, res) => { res.sendFile(indexPath) })
appRouter.get('/:redirectUrl', appRedirect)

/* utility */
appRouter.get('/rest/ping', (req, res) => { res.sendStatus(200) })

const staticRoute = express.static(publicDir)

export {appRouter, staticRoute}