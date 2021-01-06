import { Resolver, Query, Mutation, Arg, Field } from 'type-graphql'
import { hash } from 'bcrypt'

import Task from '../models/Task'
import TaskSchema from '../database/schemas/TaskSchema'
import { Schema } from 'mongoose'
import { GraphQLObjectType } from 'graphql'
import GraphQLJSON from 'graphql-type-json'

@Resolver(Task)
export default class TaskController {
  // return all Tasks
  @Query(_returns => [Task], { name: 'tasks' })
  async index() {
    const tasks = await TaskSchema.find()
    return tasks
  }

  // create a new Task
  @Mutation(_returns => Task, { name: 'createTask' })
  async store(
    @Arg('title') title: string,
    @Arg('description') description: string
  ) {
    const task = await TaskSchema.create({
      title,
      description,
      status: 'to-do'
    })

    return task
  }

  // return a single Task
  @Query(returns => Task, { name: 'fetchTask' })
  async show(@Arg('id') id: string) {
    const task = await TaskSchema.findById(id)

    if (!task) throw new Error('❌ | Task not found.')
    return task
  }

  // update a single Task
  @Mutation(returns => Task, { name: 'updateTask' })
  async update(
    @Arg('id') id: string,
    @Arg('title') title: string,
    @Arg('description') description: string
  ) {
    try {
      const task = await TaskSchema.findByIdAndUpdate(
        id,
        { title, description },
        { new: true }
      )
      return task
    } catch (error) {
      throw error
    }
  }

  // delete a single Task
  @Mutation(returns => GraphQLJSON, { name: 'deleteTask' })
  async destroy(@Arg('id') id: string) {
    try {
      await TaskSchema.deleteOne({ _id: id })
      return { message: '✅ | Task deleted successfully!' }
    } catch (error) {
      throw error
    }
  }
}
