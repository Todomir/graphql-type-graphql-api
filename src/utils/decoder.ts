import { verify } from 'jsonwebtoken'
import AuthConfig from '../config/auth'

export const getUser = (token: string) => {
  const decoded: any = verify(token, AuthConfig.jwt.secret)
  const user = JSON.parse(decoded.sub)
  return user
}

export const tokenIsValid = (token: string) => {
  const decoded: any = verify(token, AuthConfig.jwt.secret)
  return !!decoded
}
