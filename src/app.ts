import * as bodyParser from 'body-parser'
import express, { Application } from 'express'
import { IndexRoutes } from './routes'
import mongoose from 'mongoose'
import winston from 'winston'
import { errorLogger } from 'express-winston'
import { clientErrorHandler, errorHandler, logging } from './utility/errHandler'

class App {
  public app: Application
  public indexRoutes: IndexRoutes = new IndexRoutes()
  public mongoURL: string = 'mongodb://localhost/order-api'

  private mongoSetUp(): void {
    mongoose.set('useFindAndModify', false)
    mongoose.connect(this.mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
  }

  constructor() {
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.indexRoutes.routes(this.app)
    this.mongoSetUp()
    this.app.use(
      errorLogger({
        transports: [new winston.transports.Console()],
      })
    )
    this.app.use(logging)
    this.app.use(clientErrorHandler)
    this.app.use(errorHandler)
  }
}

export default new App().app
