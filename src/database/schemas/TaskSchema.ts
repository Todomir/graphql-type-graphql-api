import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './UserSchema'

export interface ITask {
  _id: any
  title: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ITasks {
  _id?: any
  author: IUser
  todo?: [ITask]
  doing?: [ITask]
  done?: [ITask]
}

interface ITaskDocument extends Document {
  author: IUser
  todo?: [ITask]
  doing?: [ITask]
  done?: [ITask]
}

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false }
  },
  { timestamps: true }
)

const TasksSchema = new Schema<ITaskDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  todo: [TaskSchema],
  doing: [TaskSchema],
  done: [TaskSchema]
})

export default mongoose.model<ITaskDocument>('Task', TasksSchema)
