import { Field, ID, ObjectType } from 'type-graphql'

import { ITask } from '../database/schemas/TaskSchema'

@ObjectType()
export default class Task implements ITask {
  @Field(type => ID)
  _id: any

  @Field()
  title: string

  @Field()
  description?: string

  @Field()
  status: string

  @Field(type => Date, { nullable: true })
  createdAt?: Date

  @Field(type => Date, { nullable: true })
  updatedAt?: Date
}
