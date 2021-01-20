require('dotenv').config()
import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'

import schema from './schema'

import cors from 'cors'

import express from 'express'
import { verify } from 'jsonwebtoken'

import './database'
import './database/schemas/UserSchema'
import './database/schemas/TaskSchema'

import AuthConfig from './config/auth'
import UserSchema from './database/schemas/UserSchema'

const port: string | number = process.env.PORT || 4000

async function app() {
  const app = express()
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          process.env.CLIENT_DEV_URL,
          process.env.CLIENT_PROD_URL
        ]
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            'The CORS policy for this site does not allow access from the specified Origin.'
          return callback(new Error(msg), false)
        }
        return callback(null, true)
      }
    })
  )
  const apolloServer = new ApolloServer({
    schema,
    validationRules: [depthLimit(10)],

    context: ({ req, res }) => {
      const token = req.headers.authorization
      const context = { req, res, token }
      return context
    }
  })

  apolloServer.applyMiddleware({ app })

  app.get('/confirmation/:token', async (req, res) => {
    try {
      const { secret } = AuthConfig.jwt
      const { sub: id }: any = verify(req.params.token, secret)
      await UserSchema.findByIdAndUpdate(JSON.parse(id), {
        emailConfirmed: true
      })
    } catch (err) {
      throw err
    }

    const url =
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_PROD_URL
        : process.env.CLIENT_DEV_URL

    return res.redirect(`${url}/login`)
  })

  app.listen({ port }, () => {
    console.log(`⚡️[server]: Server is running on port ${port}`)
  })
}

app()
