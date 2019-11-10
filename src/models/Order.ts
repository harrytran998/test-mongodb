import { OrderStatus } from '../constant/ModelsStatus'

export default interface Order {
  id: number
  userId: number
  quantity: number
  shipDate: Date
  status: OrderStatus
  complete: boolean
}
