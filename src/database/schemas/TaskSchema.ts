import mongoose, { Schema, Document } from 'mongoose'

export interface ITask {
  _id?: any
  title: string
  description?: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}

interface ITaskDocument extends Document {
  title: string
  description?: string
  status: string
  createdAt?: Date
  updatedAt?: Date
}

const TaskSchema = new Schema<ITaskDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model<ITaskDocument>('Task', TaskSchema)
