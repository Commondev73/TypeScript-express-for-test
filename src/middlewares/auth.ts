import { Request, Response, NextFunction } from 'express'
import * as Constants from '../constants'
import JWT from 'jsonwebtoken'

const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization
  try {
    if (token) {
      const decoded = JWT.verify(token, Constants.SECRET_KEY)
      req.credentials = decoded
    }
  } catch (error) {
    console.log(error)
    res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
  }
  next()
}

export { Auth }
