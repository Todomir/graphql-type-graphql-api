import { Resolver, Mutation, Arg } from 'type-graphql'
import { compare } from 'bcrypt'

import UserSchema from '../database/schemas/UserSchema'

import Auth from '../models/Auth'
import AuthConfig from '../config/auth'
import { sign } from 'jsonwebtoken'
import { tokenIsValid } from '../utils/decoder'

interface IContext {
  session: any
  req: any
  token: string
}

@Resolver(Auth)
export default class SessionController {
  // create a new session
  @Mutation(_returns => Auth)
  async login(@Arg('email') email: string, @Arg('password') password: string) {
    // check if user exists
    const user = await UserSchema.findOne({ email })
    if (!user) {
      throw new Error('❌ | Incorrect e-mail/password combination')
    }

    // check if passwords match
    const passwordMatched = await compare(password, user.password)
    if (!passwordMatched) {
      throw new Error('❌ | Incorrect e-mail/password combination')
    }

    const { secret, expiresIn } = AuthConfig.jwt
    const token = sign({}, secret, {
      subject: JSON.stringify(user),
      expiresIn
    })

    return {
      token,
      user
    }
  }
  @Mutation(_returns => Boolean)
  async validateToken(@Arg('token') token: string) {
    return tokenIsValid(token)
  }
}
