import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('⚙️ [database]: Succesfully connected to database'))
  .catch(err =>
    console.error(
      `⚙️ [database]: Error while trying connect to database: ${err}`
    )
  )
