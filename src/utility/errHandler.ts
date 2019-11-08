import { Request, NextFunction, Response } from 'express'
import { ApiLogger } from './logger'
import { Error } from 'mongoose'

export const logging = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  ApiLogger.logger.error(err)
  next(err)
}

export const clientErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
export const errorHandler = (err: Error, req: Request, res: Response) => {
  return res.status(500).send({ err: err.message })
}
