import { Application } from 'express'
import * as Controller from '../contorllers/user'
import { signIn, signUp, update, changePassword } from '../validations/user'
import { Auth } from '../middlewares/auth'
import { Validate } from '../middlewares/validate'

const Router = (app: Application) => {
  app.post('/api/auth/sign-in', Validate(signIn.schema, signIn.property), Controller.signIn)

  app.post('/api/auth/sign-up', Validate(signUp.schema, signUp.property), Controller.signUp)

  app.post('/api/auth/refresh-token', Controller.refreshToken)

  // Auth
  app.get('/api/auth/profile', Auth, Controller.getProfile)

  app.post('/api/auth/update-profile', Auth, Validate(update.schema, update.property), Controller.updateProfile)

  app.post(
    '/api/auth/change-password',
    Auth,
    Validate(changePassword.schema, changePassword.property),
    Controller.changePassword
  )
}

export default Router
