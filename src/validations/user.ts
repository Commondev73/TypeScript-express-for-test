import Joi from 'joi'
import { JoiSchema } from '../interfaces/joiValidate'

const signIn: JoiSchema = {
  property: 'body',
  schema: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
  })
}

const signUp: JoiSchema = {
  property: 'body',
  schema: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
    photo: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  })
}

const update: JoiSchema = {
  property: 'body',
  schema: Joi.object({
    photo: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required()
  })
}

const changePassword: JoiSchema = {
  property: 'body',
  schema: Joi.object({
    password: Joi.string().required(),
    newPassword: Joi.string().required()
  })
}

export { signIn, signUp, update, changePassword }
