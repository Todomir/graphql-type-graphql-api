import { Field, ObjectType } from 'type-graphql'
import { IUser } from '../database/schemas/UserSchema'
import User from './User'

interface IAuth {
  token: string
  user: IUser
}

@ObjectType()
export default class Auth implements IAuth {
  @Field()
  token: string

  @Field(_type => User)
  user: User
}
