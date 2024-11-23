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
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  // Fix cache from disk of expressjs
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  // Middleware cookie-parser
  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware error
  app.use(errorHandlingMiddleware)

  //
  const server = http.createServer(app)
  // const server = createServer(app)
  const io = socketIo(server, { cors: corsOptions })
  io.on('connection', (socket) => {
    // console.log('a user connected', socket.id)
    inviteUserToBoardSocket(socket)
  })

  if (env.BUILD_MODE === 'prod') {
    server.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `3. Hi ${env.AUTHOR}. Server running is successfully at PORT: ${process.env.PORT}`
      )
    })
  } else {
    server.listen(env.APP_PORT, env.APP_HOST, () => {
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
