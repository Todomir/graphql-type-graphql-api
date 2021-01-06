import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IUser {
  _id?: any
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

interface IUserDocument extends Document {
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model<IUserDocument>('User', UserSchema)
