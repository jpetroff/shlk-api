import express from 'express'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/ping', (req, res) => {
      res.json({
        message: 'Hello World!' 
      })
    })
    this.express.use('/api', router)
  }
}

export default new App().express