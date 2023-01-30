import express from 'express'
import { appRouter, staticRoute } from './app.routes'
import { oauthRouter } from './oauth.routes'
import graphqlYogaServer from './qraphql-yoga'
import Helmet, { HelmetOptions } from 'helmet'
import { cliColors } from './utils'
import createSession from 'express-session'
import config from '../config'


const helmetOpts : HelmetOptions = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "http://localhost:35729"],
      "style-src": null,
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}


class App {
  public express

  constructor () {
    this.express = express()
  }

  public mountRoutes (): void {
    this.express.use(staticRoute);
    this.express.use('/api', graphqlYogaServer)
    this.express.use('/', appRouter)
    this.express.use('/', oauthRouter)
  }

  public useHelmet (): void {
    this.express.use(Helmet(helmetOpts))
  }

  public useSessionStorage (store: createSession.Store): void {
    const _store = createSession({
      secret: config.APP_SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 6, // 6 months in milliseconds
        httpOnly: false,
        secure: false
      },
      store: store,
      resave: true,
      saveUninitialized: true
    })
    this.express.use(_store)
  }

  public start(port: number) {
    this.express.listen(port, () => console.log(`${cliColors.green}[✓]${cliColors.end} Server listening on port ${port}`))
  }
}

export default new App()