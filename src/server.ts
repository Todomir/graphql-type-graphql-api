require('dotenv').config()

import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import './database'
import './database/schemas/TaskSchema'

import TaskResolver from './resolvers/TaskResolver'

const port: string | number = process.env.PORT || 4000

async function app() {
  const schema = await buildSchema({ resolvers: [TaskResolver] })
  const server = new ApolloServer({ schema })

  server.listen({ port: port }, () => {
    console.log(`⚡️[server]: Server is running on port ${port}`)
  })
}

app()
