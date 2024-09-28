/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import Joi, { string } from 'joi'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const conditionTrue = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title is not allowed to be empty',
      'string.min': 'Title length must be at least 3 characters long',
      'string.max':
        'Title length must be less than or equal to 5 characters long',
      'string.trim': 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(250)
      .trim()
      .strict()
      .messages({
        'any.required': 'Description is required',
        'string.empty': 'Description is not allowed to be empty',
        'string.min': 'Description length must be at least 3 characters long',
        'string.max':
          'Description length must be less than or equal to 5 characters long',
        'string.trim':
          'Description must not have leading or trailing whitespace'
      })
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

export const boardValidation = {
  createNew
}
