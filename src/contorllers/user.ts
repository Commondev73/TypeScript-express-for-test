import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import * as Constants from '../constants'
import { Request, Response } from 'express'
import { Constants as ConstantsSdk, DB, Interfaces } from 'TypeScript-sdk-test'
import { uploadFile, removeFile } from '../utils'
import { JwtPayload } from 'jsonwebtoken'

const refreshToken = async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers
    if (authorization) {
      const decoded = JWT.verify(authorization, Constants.SECRET_KEY) as JwtPayload
      const { userId, userName } = decoded
      if (userId || userName) {
        const payload = { ...decoded }
        delete payload.iat
        delete payload.exp
        const token = JWT.sign(payload, Constants.SECRET_KEY, {
          expiresIn: Constants.TOKEN_EXPIRE
        })
        const refreshToken = JWT.sign(payload, Constants.SECRET_KEY, {
          expiresIn: Constants.REFRESH_TOKEN_EXPIRE
        })
        return res.status(200).json({
          statusCode: 200,
          data: {
            token,
            refreshToken
          }
        })
      }
    }
    return res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const signUp = async (req: Request, res: Response) => {
  try {
    const { userName, photo: rawPhoto, password: rawPassword, firstName, lastName } = req.body
    const isDuplicate = await DB.User.findOne({ userName })
    if (isDuplicate) {
      return res.status(400).json({ statusCode: 400, error: 'Bad Request', message: 'duplicate username' })
    }
    const password = bcrypt.hashSync(rawPassword, 10)
    const photo = uploadFile(rawPhoto, Constants.UPLOAD)?.pathName
    const data: Interfaces.IUser = {
      userName,
      password,
      photo,
      firstName,
      lastName
    }
    const user = await DB.User.create(data)
    if (user) {
      return res.status(200).json({ statusCode: 200, data: { message: 'success' } })
    }
    return res.status(200).json({ statusCode: 200, data: { message: 'failed' } })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const signIn = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body
    const user = await DB.User.findOne({ userName })
    if (!user) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized',  message: 'user not exists' } )
    }
    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized',  message: 'invalid password' } )
    }
    if (user.status === Interfaces.EStatusUser.BANNED) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized',  message: 'user is banned' } )
    }
    const payload = {
      userId: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status!,
      photo: user.photo ? user.photo.split('/').pop() : ''
    }
    const token = JWT.sign(payload, Constants.SECRET_KEY, {
      expiresIn: Constants.TOKEN_EXPIRE
    })
    const refreshToken = JWT.sign(payload, Constants.SECRET_KEY, {
      expiresIn: Constants.REFRESH_TOKEN_EXPIRE
    })
    return res.status(200).json({
      statusCode: 200,
      data: {
        token,
        refreshToken
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.credentials as JwtPayload
    const user = await DB.User.findById(userId)
    if (!user) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized' })
    }

    const payload = {
      ...user._doc,
      photo: user.photo ? user.photo.split('/').pop() : '',
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined
    }

    return res.status(200).json({
      statusCode: 200,
      data: payload
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.credentials as JwtPayload
    const { photo: rawPhoto, firstName, lastName } = req.body
    const user = await DB.User.findById(userId)
    if (!user) {
      return res.status(400).json({ statusCode: 400, error: 'user not exists' })
    }
    const data = {
      firstName,
      lastName,
      photo: user.photo ? user.photo : undefined
    }

    if (rawPhoto) {
      if (user.photo) {
        removeFile(user.photo)
      }
      data.photo = uploadFile(rawPhoto, Constants.UPLOAD)?.pathName
    }

    const updateUser = await DB.User.update(userId, { ...data })
    if (updateUser) {
      const payload = {
        userId: updateUser._id,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        status: updateUser.status,
        photo: updateUser.photo ? updateUser.photo.split('/').pop() : ''
      }
      const token = JWT.sign(payload, Constants.SECRET_KEY, {
        expiresIn: Constants.TOKEN_EXPIRE
      })
      const refreshToken = JWT.sign(payload, Constants.SECRET_KEY, {
        expiresIn: Constants.REFRESH_TOKEN_EXPIRE
      })
      return res.status(200).json({
        statusCode: 200,
        data: {
          token,
          refreshToken,
          message: 'success'
        }
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId } = req.credentials as JwtPayload
    const { password, newPassword } = req.body

    const user = await DB.User.findById(userId)
    if (!user) {
      return res.status(400).json({ statusCode: 400, error: 'user not exists' })
    }

    const isMatch = bcrypt.compareSync(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ statusCode: 401, error: 'Unauthorized',  message: 'invalid password' } )
    }

    const updatePassword = bcrypt.hashSync(newPassword, 10)
    const updateUser = await DB.User.update(userId, { password: updatePassword })
    if (updateUser) {
      return res.status(200).json({
        statusCode: 200,
        data: {
          message: 'success'
        }
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export { refreshToken, signUp, signIn, getProfile, updateProfile, changePassword }
