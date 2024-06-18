import express from 'express'
import { appRouter, staticRoute } from './app.routes'
import { oauthRouter } from './oauth.routes'
import graphqlYogaServer from './qraphql-yoga'
import Helmet, { HelmetOptions } from 'helmet'
import { cliColors } from './utils'
import createSession from 'express-session'
import config from '../config'
import { checkBanlist } from './ban.queries'


const helmetOpts : HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": [`'self'`],
      "style-src": [`'self'`, `*`],
      "img-src": [`'self'`, `*`],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}


class App {
  public express

  constructor () {
    this.express = express()

    // static routes should be use before session middleware:
    // site.manifest is downloaded without credentials (including session cookie)
    // this creates session every page reload
    this.express.use(staticRoute)
    this.express.set('trust proxy', true)
  }

  public mountRoutes (): this {
    this.express.use('/api', graphqlYogaServer)
    this.express.use('/', oauthRouter)
    this.express.use('/', appRouter)
    return this
  }

  public useHelmet (): this {
    this.express.use(Helmet(helmetOpts))
    return this
  }

  public useIPCheck (): this {
    this.express.use(
      async (req, res, next) => { 
        try {
          await checkBanlist(req.ip, 'IP')
          next()
        } catch(err: any) {
          res.status(500).send(err)
        }
      }
    )
    return this
  }

  public useSessionStorage (store: createSession.Store): this {
    const _store = createSession({
      secret: config.APP_SESSION_SECRET,
      name: 'sid',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months in milliseconds
        httpOnly: false,
        secure: false
      },
      store: store,
      resave: true,
      saveUninitialized: false
    })
    this.express.use(_store)
    return this
  }

  public start(port: number): this {
    this.express.listen(port, '0.0.0.0', () => console.log(`${cliColors.green}[✓]${cliColors.end} Server listening on port ${port}`))
    return this
  }
}

export default new App()