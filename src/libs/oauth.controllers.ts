import express from 'express'
import { OAuth2Client } from 'google-auth-library'
import config from '../config'

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
  // acquire the code from the querystring, and close the web server.
  const qs = new URL(req.url, 'https://shlk.cc/').searchParams
  const code = qs.get('code')
  const oAuth2Client = getAuthClient()
  
  if(!code) {
    res.sendStatus(404).json({ message: 'Authorization failed' })
  } else {
    // Now that we have the code, use that to acquire tokens.
    const r = await oAuth2Client.getToken(code);
    // Make sure to set the credentials on the OAuth2 client.
    oAuth2Client.setCredentials(r.tokens)
    console.info('Tokens acquired\n', r)
  }
}