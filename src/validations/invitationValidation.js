const { StatusCodes } = require('http-status-codes')
const Joi = require('joi')
const { default: ApiError } = require('~/utils/ApiError')
const { EMAIL_RULE, EMAIL_RULE_MESSAGE } = require('~/utils/validators')

const createNewBoardInvitation = async (req, res, next) => {
  const conditionTrue = Joi.object({
    invitedEmail: Joi.string().required(),
    boardId: Joi.string().required()
  })

  try {
    await conditionTrue.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const invitationValidation = { createNewBoardInvitation }
