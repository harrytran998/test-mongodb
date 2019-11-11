import { Document, Model, model, Schema } from 'mongoose'
import { default as Order } from '../models/order'
export const OrderStatus = {
  Placed: 'PLACED',
  Approved: 'APPROVED',
  Delivered: 'DELIVERED',
}

// export interface OrderModel extends Order, Document {}
type OrderModels = Order & Document // = above

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

export const OrderModel: Model<OrderModels> = model<OrderModels>(
  'Order',
  OrderSchema
)
