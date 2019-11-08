import { Document, Model, model, Schema } from 'mongoose'
import { default as Order } from '../models/order'
// import { OrderStatus } from '../constant/ModelsStatus'
export const OrderStatus = {
  Placed: 'PLACED',
  Approved: 'APPROVED',
  Delivered: 'DELIVERED',
}

// export interface OrderModel extends Order, Document {}
type OrderModel = Order & Document // = above

export const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
  shipDate: Date,
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Placed,
  },
  complete: Boolean,
})

export const OrderModel: Model<OrderModel> = model<OrderModel>(
  'Order',
  OrderSchema
)
