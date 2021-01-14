# API GraphQL

A simple GraphQL API using Apollo Server, Mongoose, type-graphql and Typescript.

## Initial configuration

First, you'll need to install the dependencies using your preferred package manager.
You can run either `yarn` or `npm install`.

Go to the _.env.example_, create a _.env_ file with the same fields – or duplicate and rename the file to _.env_ – and put your database URL and the port you want to serve the API.

You now are free to send queries and mutations through the playground available on the API, or send requests through your front-end application.

## Models

### User

The user model is composed of a name, email and a password. All of the fields are required.

```typescript
name:  string
email:  string
password:  string
createdAt?:  Date
updatedAt?:  Date
```

The timestamps are created automatically.

### Task

The task model is composed of a title, an optional description, an status, and a author. To access the tasks the user must be authenticated. During the task creation, author will be set to the authenticated user.

```typescript
title:  string
description:  string
status:  string
createdAt?:  Date
updatedAt?:  Date
```

Just like the user, all of the timestamps are generated automatically. The status is defaulted as `to-do` during the creation of a task.

## Creating a user

You can create a new user using the `createUser` mutation:

```graphql
mutation {
  createUser(email: "email@email.com", password: "password", name: "John Doe") {
    _id
    name
    email
  }
}
```

After creating a user, you can login using the `login` mutation, which will return a JWT and the user data:

```graphql
mutation {
  login(email: "email@email.com", password: "password") {
    token
    user {
      _id
      name
      email
    }
  }
}
```

Then, you can validate the token using the `validateToken` mutation. The mutation receives the token as a argument and will return true if a valid token is provided, and false otherwise.

```graphql
mutation {
  validateToken(token: "your_jwt_token")
}
```

## Updating a user

You can update the name and password of the user using the `updateUser` mutation, you'll need to pass the user id for the mutation to work.

```graphql
mutation {
  updateUser(
    id: "your_user_id"
    name: "Paul Thomas"
    password: "another_password"
  ) {
    user {
      _id
      name
      email
    }
  }
}
```

## Deleting a user

You can delete the user from the database using the `deleteUser` mutation, you'll need to pass the user id for the mutation to work.

```graphql
mutation {
  deleteUser(id: "your_user_id")
}
```

This mutation returns a message if the deletion was successful and throws an error if it wasn't.

## Creating a task

You can create a new task using the `createTask` mutation. The description field is optional and defaults to null if not provided.

```graphql
mutation {
  createTask(
    title: "Learn HTML, CSS and JS"
    description: "The foundation of modern web."
  ) {
    _id
    title
    description
    author {
      _id
    }
  }
}
```

## Updating a task

You can update the title and description a task using the `updateTask` mutation, you'll need to pass the task id for the mutation to work.

```graphql
mutation {
  updateTask(
    id: "your_task_id"
    title: "Study GraphQL"
    description: "It just makes everything easier, doesn't?"
  )
}
```

This mutation returns a message if the update was successful and throws an error if it wasn't.

## Deleting a task

You can delete a task from the database using the `deleteTask` mutation, you'll need to pass the task id for the mutation to work.

```graphql
mutation {
  deleteTask(id: "your_task_id")
}
```

This mutation returns a message if the deletion was successful and throws an error if it wasn't.

## Fetching users

You can fetch all users using the `users` query:

```graphql
query {
  users {
    _id
    name
    email
  }
}
```

## Fetching a single user

You can fetch a single users using the `fetchUser` query. You'll need to pass the user id for the query to work.

```graphql
query {
  fetchUser(id: "your_user_id") {
    _id
    name
    email
  }
}
```

## Fetching users

You can fetch all tasks using the `tasks` query:

```graphql
query {
  tasks {
    _id
    title
    description
    status
    author {
      _id
    }
  }
}
```

This query returns the tasks in which the author is the authenticated user. In case there is not an user authenticated, it will throw an error.

## Fetching a single task

You can fetch a single users using the `fetchTask` query. You'll need to pass the task id for the query to work.

```graphql
query {
  fetchTask(id: "your_task_id") {
    _id
    title
    description
    status
    author {
      _id
    }
  }
}
```

This query returns a task in which the author is the authenticated user. In case there is not an user authenticated, it will throw an error.
