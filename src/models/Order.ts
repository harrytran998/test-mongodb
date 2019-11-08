import { OrderStatus } from '../constant/ModelsStatus'

export default interface Order {
  id: Number
  userId: Number
  quantity: Number
  shipDate: Date
  status: OrderStatus
  complete: Boolean
}
