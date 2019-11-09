import halson from 'halson'
import _ from 'lodash'
import { OrderModel } from '../schemas/order'
import { UserModel } from '../schemas/User'
import { formatOutput } from '../utility/orderApiUtility'
import { Request, Response } from 'express'
import { ApiLogger } from '../utility/logger'

export const getOrder = (req: Request, res: Response) => {
  const id = req.params.id
  ApiLogger.logger.info(`[GET] [/store/orders/] ${id}`)
  OrderModel.findById(id)
    .then(order => {
      if (!order) {
        ApiLogger.logger.info(
          `[GET] [/store/orders/:${order._id}] Order ${id} not found.`
        )
      }
      return formatOutput(res, order, 200)
    })
    .catch(err => {
      return formatOutput(res, err, 404)
    })
}

export const getAllOrders = (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 0
  const offset = Number(req.query.offset) || 0
  ApiLogger.logger.info(`[GET] [/store/orders/]`)
  OrderModel.find({}, null, { skip: offset, limit: limit }).then(orders => {
    if (orders) {
      orders = orders.map(order => {
        return halson(order.toJSON())
          .addLink('self', `/store/orders/${order.id}`)
          .addLink('user', {
            href: `/users/${order.userId}`,
          })
      })
    }
    return formatOutput(res, orders, 200, 'order')
  })
}

export const addOrder = (req: Request, res: Response) => {
  UserModel.findById(req.body.userId).then(user => {
    if (!user) {
      return res.status(404).send()
    }

    const newOrder = new OrderModel(req.body)

    newOrder.save().then(order => {
      order = halson(order.toJSON())
        .addLink('self', `/store/orders/${order._id}`)
        .addLink('user', {
          href: `/users/${order.userId}`,
        })

      return formatOutput(res, order, 201, 'order')
    })
  })
}

export const removeOrder = (req: Request, res: Response) => {
  OrderModel.findByIdAndRemove(req.params.id).then(() => {
    return res.status(204).send('Remove order successfully')
  })
}

export const getInventory = (req: Request, res: Response) => {
  const status = req.query.status
  OrderModel.find({ status }, (err, orders) => {
    console.log(orders)
    const temp = _.groupBy(orders, 'userId')
    console.log(temp)
    return formatOutput(res, temp, 200, 'inventory')
  })
}
