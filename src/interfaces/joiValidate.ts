import { ObjectSchema } from 'joi'

export interface JoiSchema {
  property: 'body' | 'query'
  schema: ObjectSchema
}
