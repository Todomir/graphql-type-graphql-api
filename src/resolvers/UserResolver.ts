import { Resolver, Query, Mutation, Arg, Field } from 'type-graphql'
import { hash } from 'bcrypt'

import User from '../models/User'
import UserSchema from '../database/schemas/UserSchema'
import { Schema } from 'mongoose'
import { GraphQLObjectType } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

@Resolver(User)
export default class UserController {
  // return all users
  @Query(_returns => [User], { name: 'users' })
  async index() {
    const users = await UserSchema.find()
    return users
  }

  // create a new user
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

  // return a single user
  @Query(returns => User, { name: 'fetchUser' })
  async show(@Arg('email') email: string) {
    const user = await UserSchema.findOne({ email: email })

    if (!user) throw new Error('❌ | User not found.')
    return user
  }

  // update a single user
  @Mutation(returns => User, { name: 'updateUser' })
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
      return user
    } catch (error) {
      throw error
    }
  }

  // delete a single user
  @Mutation(returns => GraphQLJSON, { name: 'deleteUser' })
  async destroy(@Arg('id') id: string) {
    try {
      await UserSchema.deleteOne({ _id: id })
      return { message: '✅ | User deleted successfully!' }
    } catch (error) {
      throw error
    }
  }
}
