import { Field, ID, ObjectType } from 'type-graphql'

import { IUser } from '../database/schemas/UserSchema'

@ObjectType()
export default class User implements IUser {
  @Field(type => ID)
  _id: any

  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string

  @Field(type => Date, { nullable: true })
  createdAt?: Date

  @Field(type => Date, { nullable: true })
  updatedAt?: Date
}
