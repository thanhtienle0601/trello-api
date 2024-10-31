/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list cards' })
  })
  .post(
    authMiddleware.isAuthorized,
    cardValidation.createNew,
    cardController.createNew
  )

export const cardRoutes = Router
