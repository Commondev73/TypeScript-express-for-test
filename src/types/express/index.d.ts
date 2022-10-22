import { JwtPayload } from 'jsonwebtoken'

declare module 'Express' {
  export interface Request {
    credentials?: string | JwtPayload
  }
}