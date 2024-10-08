/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes'
import { columnRoutes } from './columnRoutes'
import { cardRoutes } from './cardRoutes'

const Router = express.Router()

Router.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use !' })
})

Router.use('/boards', boardRoutes)
Router.use('/columns', columnRoutes)
Router.use('/cards', cardRoutes)

export const APIs_V1 = Router
