import * as orderController from '../controllers/order'
import * as apiController from '../controllers/api'
import * as userController from '../controllers/user'
import { Application } from 'express'
import { PassportConfiguration } from '../config/passport'
import passport from 'passport'

export class IndexRoutes extends PassportConfiguration {
  public routes(app: Application): void {
    app.route('/login').post(userController.login)
    app
      .route('/users')
      .post(
        // passport.authenticate('jwt', { session: false }),
        userController.signUp
      )
      .get(
        passport.authenticate('jwt', { session: false }),
        userController.getUsers
      )
    app
      .route('/users/:username')
      .patch(
        passport.authenticate('jwt', { session: false }),
        userController.updateUser
      )
      .delete(
        passport.authenticate('jwt', { session: false }),
        userController.removeUser
      )
      .get(
        passport.authenticate('jwt', { session: false }),
        userController.getUser
      )
    app
      .route('/store/inventory')
      .get(
        passport.authenticate('jwt', { session: false }),
        orderController.getInventory
      )
    app
      .route('/store/orders')
      .post(
        passport.authenticate('jwt', { session: false }),
        orderController.addOrder
      )
      .get(
        passport.authenticate('jwt', { session: false }),
        orderController.getAllOrders
      )
    app
      .route('/store/orders/:id')
      .get(
        passport.authenticate('jwt', { session: false }),
        orderController.getOrder
      )
      .delete(
        passport.authenticate('jwt', { session: false }),
        orderController.removeOrder
      )

    app.route('/api').get(apiController.getApi)
  }
}
