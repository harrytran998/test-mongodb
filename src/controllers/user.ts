import halson from 'halson'
import { formatOutput } from '../utility/orderApiUtility'
import { Request, Response } from 'express'
import { UserModel } from '../schemas/User'
import { compareSync, hashSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { ApiLogger } from '../utility/logger'

export const getUsers = (req: Request, res: Response) => {
  UserModel.find().then(users => {
    if (!users) {
      return res.status(404).send('Dont have any user')
    }
    return formatOutput(res, users, 200, 'users')
  })
}

export const getUser = (req: Request, res: Response) => {
  const username = req.params.username

  UserModel.findOne({ username }).then(user => {
    if (!user) {
      return res.status(404).send('Not found user')
    }

    user._id = user._id.toString()
    user = user.toJSON()
    user = halson(user).addLink('self', `/users/${user._id}`)
    return formatOutput(res, user, 200, 'user')
  })
}

export const signUp = (req: Request, res: Response) => {
  const newUser = new UserModel(req.body)
  newUser.password = hashSync(newUser.password, +(process.env.SALT as string))
  newUser.save((err, user) => {
    if (user) {
      user = halson(user.toJSON()).addLink('self', `/users/${user._id}`)
      return formatOutput(res, user, 201, 'user')
    } else {
      return res.status(500).send(err.message)
    }
  })
}

export const updateUser = (req: Request, res: Response) => {
  const updateData = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    userStatus: req.body.userStatus,
  }
  UserModel.findOneAndUpdate(
    { username: req.params.username },
    updateData
  ).then(user => {
    if (!user) {
      return res.status(404).send()
    }
    return res.status(200).send('Updated successfully')
  })
}

export const removeUser = (req: Request, res: Response) => {
  UserModel.findOne({ username: req.params.username }, (err, user) => {
    if (!user) {
      return res.status(404).send()
    }

    user.remove(err => {
      if (err) {
        return formatOutput(res, err.message, 500)
      }
      res.status(200).send('Remove successfully')
    })
  })
}

export const login = (req: Request, res: Response) => {
  const { username, password } = req.query
  UserModel.findOne({ username }).then(user => {
    if (!user) {
      ApiLogger.logger.info(
        `[GET] [/users/login] no user found with the username ${username}`
      )
      return res.status(404).send()
    }
    ApiLogger.logger.info(`[GET] [/users/login] Have username ${username}`)
    const validate = compareSync(password, user.password as string)
    if (validate) {
      const token = sign(
        {
          _id: user._id,
          email: user.email,
        },
        process.env.JWT
      )
      return res.json({ token, user })
    } else {
      ApiLogger.logger.info(
        `[GET] [/users/login] user not authorized ${username}`
      )
      return res.status(401).send()
    }
  })
}
