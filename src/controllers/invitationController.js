import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const invitingId = req.jwtDecoded._id
    const resInvitation = await invitationService.createNewBoardInvitation(
      req.body,
      invitingId
    )

    return res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

export const invitationController = { createNewBoardInvitation }
