/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import 'dotenv/config'
import { env } from './config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(cors())

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //Middleware error
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'prod') {
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3. Hi ${env.AUTHOR}. Server running is successfully at PORT: ${env.PORT}`
      )
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3. Hi ${env.AUTHOR}. Server running is successfully at http://${env.APP_HOST}:${env.APP_PORT}/`
      )
    })
  }

  exitHook(() => {
    console.log('4. Disconnecting from MongoDB Cloud Atlas...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas!')
  })
}

;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...!')
    await CONNECT_DB()
    console.log('2. Connected to MongoDb Atlas!')

    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
