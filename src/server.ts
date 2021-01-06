import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'
import { buildSchema } from 'type-graphql'

import './database'
import './database/schemas/UserSchema'

import UserResolver from './resolvers/UserResolver'

async function app() {
  const schema = await buildSchema({ resolvers: [UserResolver] })
  const server = new ApolloServer({ schema })

  server.listen({ port: process.env.PORT }, () => {
    console.log(
      `⚡️[server]: Server is running on http://localhost:${process.env.PORT}`
    )
  })
}

app()
