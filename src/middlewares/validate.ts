import { Request, Response, NextFunction } from 'express'
import { ObjectSchema, ValidationResult } from 'joi'

const Validate = (schema: ObjectSchema, property: 'body' | 'query') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error }: ValidationResult = schema.validate(req[property])
      if (error) {
        console.log('error', error)
        res.status(400).json({ statusCode: 400, error })
      } else next()
    } catch (error) {
      console.log(error)
      res.status(422).json({ statusCode: 422, error })
    }
  }
}

export { Validate }
