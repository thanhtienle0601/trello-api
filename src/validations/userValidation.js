import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'

const createNew = async (req, res, next) => {
  const conditionTrue = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
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
const verifyAccount = async (req, res, next) => {
  const conditionTrue = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    token: Joi.string().required()
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
const login = async (req, res, next) => {
  const conditionTrue = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
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

const update = async (req, res, next) => {
  const conditionTrue = Joi.object({
    displayName: Joi.string().trim().strict(),
    current_password: Joi.string()
      .pattern(PASSWORD_RULE)
      .message(`current_password ${PASSWORD_RULE_MESSAGE}`),
    new_password: Joi.string()
      .pattern(PASSWORD_RULE)
      .message(`new_password ${PASSWORD_RULE_MESSAGE}`)
  })

  try {
    await conditionTrue.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
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

export const userValidation = {
  createNew,
  verifyAccount,
  login,
  update
}
