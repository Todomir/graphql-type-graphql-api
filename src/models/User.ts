import { Field, ID, ObjectType } from 'type-graphql'
import { ITask } from '../database/schemas/TaskSchema'

import { IUser } from '../database/schemas/UserSchema'
import Task from './Task'

@ObjectType()
export default class User implements IUser {
  @Field(_type => ID)
  _id: any

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string

  @Field(_type => Date, { nullable: true })
  createdAt?: Date

  @Field(_type => Date, { nullable: true })
  updatedAt?: Date
}
