import { Field, ID, ObjectType } from 'type-graphql'

import { ITask, ITasks } from '../database/schemas/TaskSchema'
import { IUser } from '../database/schemas/UserSchema'
import User from './User'

@ObjectType()
export class Task implements ITask {
  @Field(_type => ID)
  _id: any

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(_type => Date, { nullable: true })
  createdAt?: Date

  @Field(_type => Date, { nullable: true })
  updatedAt?: Date
}

@ObjectType()
export default class Tasks implements ITasks {
  @Field(_type => ID)
  _id: any

  @Field(_type => User)
  author: IUser

  @Field(_type => [Task], { nullable: true })
  todo?: [ITask]

  @Field(_type => [Task], { nullable: true })
  doing?: [ITask]

  @Field(_type => [Task], { nullable: true })
  done?: [ITask]
}
