import { Resolver, Query, Mutation, Arg } from 'type-graphql'
import { hash } from 'bcrypt'

import User from '../models/User'
import UserSchema from '../database/schemas/UserSchema'
import GraphQLJSON from 'graphql-type-json'

@Resolver(User)
export default class UserController {
  // return all Users
  @Query(_returns => [User], { name: 'users' })
  async index() {
    const users = await UserSchema.find().select([
      '_id',
      'name',
      'email',
      'createdAt',
      'updatedAt'
    ])
    return users
  }

  // create a new User
  @Mutation(_returns => User, { name: 'createUser' })
  async store(
    @Arg('name') name: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 10)
    const user = await UserSchema.create({
      name,
      email,
      password: hashedPassword
    })

    return user
  }

  // return a single User
  @Query(_returns => User, { name: 'fetchUser' })
  async show(@Arg('id') id: string) {
    const user = await UserSchema.findById(id)

    if (!user) throw new Error('❌ | User not found.')
    return user
  }

  // update a single User
  @Mutation(_returns => User, { name: 'updateUser' })
  async update(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Arg('password') password: string
  ) {
    try {
      const user = await UserSchema.findByIdAndUpdate(
        id,
        { name, password },
        { new: true }
      )

      if (!user) throw new Error('❌ | User not found.')
      return user
    } catch (error) {
      throw error
    }
  }

  // delete a single User
  @Mutation(_returns => GraphQLJSON, { name: 'deleteUser' })
  async destroy(@Arg('id') id: string) {
    try {
      await UserSchema.deleteOne({ _id: id })
      return { message: '✅ | User deleted successfully!' }
    } catch (error) {
      throw error
    }
  }
}
