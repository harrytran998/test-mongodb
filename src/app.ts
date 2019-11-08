import bodyParser from 'body-parser'
import express, { Application } from 'express'
import { IndexRoutes } from './routes'
import mongoose from 'mongoose'
import winston from 'winston'
import { errorLogger } from 'express-winston'
import { clientErrorHandler, errorHandler, logging } from './utility/errHandler'
import dotenv from 'dotenv'

class App {
  public app: Application
  public indexRoutes: IndexRoutes = new IndexRoutes()
  public mongoUrl: string
  public mongoUser: string
  public mongoPass: string

  constructor() {
    const path = `${__dirname}/../.env.${process.env.NODE_ENV}`
    dotenv.config({ path })

    this.mongoUrl = `mongodb://${process.env.MONGODB_URL_PORT}/${process.env.MONGODB_DATABASE}`
    this.mongoUser = `${process.env.MONGODB_USER}`
    this.mongoPass = `${process.env.MONGODB_PASS}`
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

  private mongoSetUp(): void {
    let options

    if (process.env.NODE_ENV !== 'prod') {
      options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    } else {
      options = {
        user: this.mongoUser,
        pass: this.mongoPass,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    }
    mongoose.connect(this.mongoUrl, options)
  }
}

export default new App().app
