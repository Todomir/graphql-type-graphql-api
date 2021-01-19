import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Authorized,
  Ctx,
  InputType,
  Field,
  ID
} from 'type-graphql'

import { ITask } from '../database/schemas/TaskSchema'
import TasksSchema from '../database/schemas/TaskSchema'
import GraphQLJSON from 'graphql-type-json'

import mongoose from 'mongoose'

import { getUser } from '../utils/decoder'
import { Task } from '../models/Task'
import Tasks from '../models/Task'

interface IContext {
  query: any
  token?: string
}

@InputType()
class NewTaskInput {
  @Field(_type => ID)
  _id?: any

  @Field(_type => String)
  title: string

  @Field(_type => String)
  description: string
}

@InputType()
class NewTasksInput {
  @Field(_type => [NewTaskInput])
  todo: [ITask]

  @Field(_type => [NewTaskInput])
  doing: [ITask]

  @Field(_type => [NewTaskInput])
  done: [ITask]
}

@Resolver(Tasks)
export default class TaskController {
  // return all Tasks
  @Authorized()
  @Query(_returns => [Tasks], { name: 'tasks' })
  async index(@Ctx() ctx: IContext) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const tasks = await TasksSchema.find({ author: user._id })
    console.log(tasks)
    return tasks
  }

  // create a new Task
  @Authorized()
  @Mutation(_returns => Task, { name: 'createTask' })
  async store(
    @Arg('title') title: string,
    @Ctx() ctx: IContext,
    @Arg('description', { nullable: true }) description?: string
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const taskDoc = await TasksSchema.findOne({ author: user._id })

    if (!taskDoc) {
      const item = { _id: mongoose.Types.ObjectId(), title, description }
      await TasksSchema.create({
        author: user._id,
        todo: [{ title, description }]
      })
      return item
    } else {
      const item = { _id: mongoose.Types.ObjectId(), title, description }
      taskDoc.todo.push(item)
      await taskDoc.save()
      return item
    }
  }

  // return a single Task
  @Authorized()
  @Query(_returns => Task, { name: 'fetchTask' })
  async show(
    @Arg('id') id: string,
    @Arg('status') status: 'todo' | 'doing' | 'done',
    @Ctx() ctx: IContext
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const tasks = await TasksSchema.findOne({ author: user._id })
    const task = tasks[status].filter((task: ITask) => task._id == id)

    const reducedTask = task.reduce((acc: any, {}) => ({ ...acc }))

    if (task.length < 0) throw new Error('Task not found.')
    return reducedTask
  }

  // update Tasks
  @Authorized()
  @Mutation(_returns => Tasks, { name: 'updateTasks' })
  async update(
    @Arg('tasks', _type => NewTasksInput) tasks: NewTasksInput,
    @Ctx() ctx: IContext
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    await TasksSchema.updateOne(
      { author: user._id },
      { ...tasks, author: user._id },
      { upsert: true }
    )

    const doc = await TasksSchema.findOne({ author: user._id })
    return doc
  }

  // delete a single Task
  @Authorized()
  @Mutation(_returns => GraphQLJSON, { name: 'deleteTask' })
  async destroy(
    @Arg('id') id: string,
    @Arg('status') status: 'todo' | 'doing' | 'done',
    @Ctx() ctx: IContext
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)
    try {
      const tasks = await TasksSchema.findOne({ author: user._id })

      tasks[status].pull({ _id: id })
      await tasks.save()

      return { message: '✅ | Task deleted successfully!' }
    } catch (error) {
      throw error
    }
  }
}
