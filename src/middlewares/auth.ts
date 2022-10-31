import { Request, Response, NextFunction } from 'express'
import * as Constants from '../constants'
import JWT, { JwtPayload } from 'jsonwebtoken'

const Auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization
    if (!token) res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
    const decoded = JWT.verify(token!, Constants.SECRET_KEY)
    const { userId, userName } = decoded as JwtPayload
    if (!userId && !userName) res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
    req.credentials = decoded
    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({ statusCode: 401, error })
  }
}

export { Auth }
