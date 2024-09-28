/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'

const createNew = (req, res, next) => {
  try {
    console.log('req.body: ', req.body)

    //navigate to service

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'POST from controller: API create boards' })
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

export const boardController = {
  createNew
}
