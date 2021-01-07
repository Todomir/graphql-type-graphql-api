import { verify } from 'jsonwebtoken'
import { AuthChecker } from 'type-graphql'
import AuthConfig from '../config/auth'

interface IContext {
  token?: string
}

const AuthAssurance: AuthChecker<IContext> = ({ context }): boolean => {
  const authHeader = context.token

  // check if there is a token
  if (!authHeader) return false

  // check if token is valid
  const token = authHeader.replace(/^Bearer\s/, '')

  try {
    const decoded = verify(token, AuthConfig.jwt.secret)
    return !!decoded
  } catch (error) {
    return false
  }
}

export default AuthAssurance
