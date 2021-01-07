import { Field, ID, ObjectType } from 'type-graphql'

import { ITask } from '../database/schemas/TaskSchema'
import { IUser } from '../database/schemas/UserSchema'
import User from './User'

@ObjectType()
export default class Task implements ITask {
  @Field(_type => ID)
  _id: any

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(_type => User)
  author: IUser

  @Field()
  status: string

  @Field(_type => Date, { nullable: true })
  createdAt?: Date

  @Field(_type => Date, { nullable: true })
  updatedAt?: Date
}
