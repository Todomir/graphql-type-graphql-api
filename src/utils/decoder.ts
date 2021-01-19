import { verify } from 'jsonwebtoken'
import AuthConfig from '../config/auth'

export const tokenIsValid = (token: string) => {
  const decoded: any = verify(token, AuthConfig.jwt.secret)
  return decoded
}
