import express from 'express'
import { OAuth2Client } from 'google-auth-library'
import config from '../config'
import { createOrUpdateUser } from './auth-queries.db'
import {google} from 'googleapis'
// import session from 'express-session'

declare module 'express-session' {
  interface SessionData {
    userId: string;
    tokens: import('google-auth-library').Credentials
  }
}


function getAuthClient () {
  return new OAuth2Client(
    config.web.client_id,
    config.web.client_secret,
    config.web.redirect_uris[0]
  )
}

export function oauthRedirect (req: express.Request, res: express.Response) {
  const oAuth2Client = getAuthClient()
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' ')
  });

  res.redirect(authorizeUrl)
}

export async function oauthCallback (req: express.Request, res: express.Response) {
  const qs = new URL(req.url, 'https://shlk.cc/').searchParams
  const code = qs.get('code')
  const oAuth2Client = getAuthClient()
  
  if(!code) {
    res.sendStatus(400).json({ message: 'Authorization failed' })

  } else {
    try {
      const r = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(r.tokens)
      const gapi = google.oauth2({
        auth: oAuth2Client,
        version: 'v2'
      })
      const { data } = await gapi.userinfo.v2.me.get()
      if(!data.email || !data.verified_email) throw new Error('Your email is not verified. Please verify before signing in')

      const user = await createOrUpdateUser({
        email: data.email,
        name: data.given_name || data.family_name || data.email,
        avatar: data.picture,
        id_token: r.tokens.id_token,
        access_token: r.tokens.access_token,
        refresh_token: r.tokens.refresh_token
      })

      req.session.userId = user?._id
      req.session.tokens = r.tokens

      res.redirect('/')
    } catch(err) {
      console.log(err)
      res.status(400).send(err)
    }
  }
}

export function sessionLogout(req: express.Request, res: express.Response) {
  req.session.destroy(
    (err) => {
      if(err) {
        res.send(400).json(JSON.stringify(err)); return
      }
      res.redirect('/')
    }
  )
}