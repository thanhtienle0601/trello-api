/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { columnController } from '~/controllers/columnController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list columns' })
  })
  .post(
    authMiddleware.isAuthorized,
    columnValidation.createNew,
    columnController.createNew
  )

Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    columnValidation.update,
    columnController.update
  )
  .delete(
    authMiddleware.isAuthorized,
    columnValidation.deleteColumnById,
    columnController.deleteColumnById
  )

export const columnRoutes = Router
