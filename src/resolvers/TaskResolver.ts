import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from 'type-graphql'

import { ITask } from '../database/schemas/TaskSchema'
import TasksSchema from '../database/schemas/TaskSchema'
import GraphQLJSON from 'graphql-type-json'

import { getUser } from '../utils/decoder'
import { Task } from '../models/Task'
import Tasks from '../models/Task'

interface IContext {
  query: any
  token?: string
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
  @Mutation(_returns => Tasks, { name: 'createTask' })
  async store(
    @Arg('title') title: string,
    @Ctx() ctx: IContext,
    @Arg('description', { nullable: true }) description?: string
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const taskDoc = await TasksSchema.findOne({ author: user._id })

    if (!taskDoc) {
      const task = await TasksSchema.create({
        author: user._id,
        todo: [{ title, description }]
      })
      return task
    } else {
      taskDoc.todo.push({ title, description })
      const updated = await taskDoc.save()
      return updated
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

    console.log(reducedTask)

    if (task.length < 0) throw new Error('❌ | Task not found.')
    return reducedTask
  }

  // update a single Task
  @Authorized()
  @Mutation(_returns => Tasks, { name: 'updateTask' })
  async update(
    @Arg('id') id: string,
    @Ctx() ctx: IContext,
    @Arg('title', { nullable: true }) title: string,
    @Arg('description', { nullable: true }) description: string,
    @Arg('currentStatus') currentStatus: 'todo' | 'doing' | 'done',
    @Arg('status') status: 'todo' | 'doing' | 'done'
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const tasks = await TasksSchema.findOne({ author: user._id })

    try {
      if (status !== currentStatus) {
        tasks[currentStatus].pull({ _id: id })
        tasks[status].push({ title, description })
        const updated = await tasks.save()

        return updated
      }
    } catch (error) {
      throw error
    }
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
