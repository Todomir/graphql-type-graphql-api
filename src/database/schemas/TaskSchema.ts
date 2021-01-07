import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './UserSchema'

export interface ITask {
  _id?: any
  title: string
  description?: string
  status: string
  author: IUser
  createdAt?: Date
  updatedAt?: Date
}

interface ITaskDocument extends Document {
  title: string
  description?: string
  status: string
  author: IUser
  createdAt?: Date
  updatedAt?: Date
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

export default mongoose.model<ITaskDocument>('Task', TaskSchema)
