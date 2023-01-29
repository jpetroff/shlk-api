import express from 'express'
import { oauthRedirect, oauthCallback } from './oauth.controllers'

const oauthRouter = express.Router() 

oauthRouter.get('/oauth/google', oauthRedirect)
oauthRouter.get(`/oauth/google/callback`, oauthCallback)


export { oauthRouter }