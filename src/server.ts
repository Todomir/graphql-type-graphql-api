require('dotenv').config()
import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import schema from './schema'

import './database'
import './database/schemas/UserSchema'
import './database/schemas/TaskSchema'

const port: string | number = process.env.PORT || 4000

async function app() {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization
      const context = { req, token }
      return context
    }
  })

  server.listen({ port }).then(({ url }) => {
    console.log(`⚡️[server]: Server is running on ${url}`)
  })
}

app()
