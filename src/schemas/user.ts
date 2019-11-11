import { Document, Model, model, Schema } from 'mongoose'
import { default as User } from '../models/user'
import uniqueValue from 'mongoose-unique-validator'

// export interface UserModel extends User, Document {}
type UserModels = User & Document // = above

export const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  phone: String,
  userStatus: Number,
  username: String,
})

UserSchema.plugin(uniqueValue)

export const UserModel: Model<UserModels> = model<UserModels>(
  'User',
  UserSchema
)
