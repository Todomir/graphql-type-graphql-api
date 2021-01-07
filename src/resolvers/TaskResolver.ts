import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from 'type-graphql'

import Task from '../models/Task'
import TaskSchema from '../database/schemas/TaskSchema'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'

import { getUser } from '../utils/decoder'

interface IContext {
  query: any
  token?: string
}

@Resolver(Task)
export default class TaskController {
  // return all Tasks
  @Authorized()
  @Query(_returns => [Task], { name: 'tasks' })
  async index(@Ctx() ctx: IContext) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const tasks = await TaskSchema.find({ author: user._id })
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

    const task = await TaskSchema.create({
      title,
      description,
      author: user._id,
      status: 'to-do'
    })
    return task
  }

  // return a single Task
  @Authorized()
  @Query(_returns => Task, { name: 'fetchTask' })
  async show(@Arg('id') id: string, @Ctx() ctx: IContext) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)

    const task = await TaskSchema.find({ _id: id, author: user._id })

    if (!task) throw new Error('❌ | Task not found.')
    return task
  }

  // update a single Task
  @Authorized()
  @Mutation(_returns => GraphQLJSONObject, { name: 'updateTask' })
  async update(
    @Arg('id') id: string,
    @Ctx() ctx: IContext,
    @Arg('title', { nullable: true }) title: string,
    @Arg('description', { nullable: true }) description: string
  ) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)
    try {
      const task = await TaskSchema.findById(id)
      if (task.author._id === user.id) {
        await TaskSchema.updateOne(
          { _id: id, author: user._id },
          { title, description },
          { new: true }
        )
        return { message: '✅ | Task updated successfully!' }
      } else {
        throw new Error('❌ | Author id and user id does not match.')
      }
    } catch (error) {
      throw error
    }
  }

  // delete a single Task
  @Authorized()
  @Mutation(_returns => GraphQLJSON, { name: 'deleteTask' })
  async destroy(@Arg('id') id: string, @Ctx() ctx: IContext) {
    const token = ctx.token?.replace(/^Bearer\s/, '')
    const user = getUser(token as string)
    try {
      const task = await TaskSchema.findById(id)
      if (task.author._id === user.id) {
        await TaskSchema.deleteOne({ _id: id, author: user._id })
        return { message: '✅ | Task deleted successfully!' }
      } else {
        throw new Error('❌ | Author id and user id does not match.')
      }
    } catch (error) {
      throw error
    }
  }
}
