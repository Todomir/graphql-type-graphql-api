import { buildSchemaSync } from 'type-graphql'

import AuthAssurance from './middlewares/AuthAssurance'

import Auth from './models/Auth'
import Task from './models/Task'
import User from './models/User'

import SessionController from './resolvers/SessionResolver'
import TaskController from './resolvers/TaskResolver'
import UserController from './resolvers/UserResolver'

const schema = buildSchemaSync({
  resolvers: [
    User,
    UserController,
    Task,
    TaskController,
    Auth,
    SessionController
  ],
  authChecker: AuthAssurance
})

export default schema
