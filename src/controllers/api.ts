import { NextFunction, Request, Response } from 'express'
import { formatOutput } from '../utility/orderApiUtility'

export const getApi = (req: Request, res: Response, next: NextFunction) => {
  return formatOutput(res, { title: 'Order API' }, 200)
}
