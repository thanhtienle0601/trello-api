/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const conditionTrue = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  })

  try {
    await conditionTrue.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    // res
    //   .status(StatusCodes.UNPROCESSABLE_ENTITY)
    //   .json({ errors: new Error(error).message })
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const columnValidation = {
  createNew
}
