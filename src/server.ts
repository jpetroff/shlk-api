import express from 'express'
import path from 'path'

class Server {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()

    router.get('/api/ping', (req, res) => {
      res.json({ 
        message: 'Hello World!!'
      })
    })

    router.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public/index.html'));
    })

    this.express.use('/', router)
    this.express.use(express.static(path.join(__dirname, 'public')))
  }
}

export default new Server().express