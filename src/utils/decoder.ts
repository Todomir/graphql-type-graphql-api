import { verify } from 'jsonwebtoken'
import AuthConfig from '../config/auth'

export const getId = (token: string) => {
  const decoded: any = verify(token, AuthConfig.jwt.secret)
  const id = JSON.parse(decoded.sub)
  return id
}
