import express from 'express'
import { appRouter, staticRoute } from './app-router'
import graphql from './qraphql'


class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    this.express.use(staticRoute);
		this.express.use('/api', graphql)
    this.express.use('/', appRouter)
  }

	public start(port: number) {
		this.express.listen(port)
	}
}

export default new App()