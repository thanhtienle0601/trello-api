/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { get } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'
import { pickUser } from '~/utils/formatters'

const createNewBoardInvitation = async (reqBody, invitingId) => {
  try {
    const invitingUser = await userModel.findOneById(invitingId)
    const invitedUser = await userModel.findOneByEmail(reqBody.invitedEmail)
    const board = await boardModel.findOneById(reqBody.boardId)

    if (!invitingUser || !invitedUser || !board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User or Board not found')
    }

    const newInvitationData = {
      invitingId,
      invitedId: invitedUser._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      // boardId: board._id.toString(),
      // status: BOARD_INVITATION_STATUS.PENDING
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    )
    const getInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId.toString()
    )
    const resInvitation = {
      ...getInvitation,
      board,
      invitingUser: pickUser(invitingUser),
      invitedUser: pickUser(invitedUser)
    }
    return resInvitation
  } catch (error) {
    throw error
  }
}

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId)
    // console.log(getInvitations)

    const resInvitations = getInvitations.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))

    return resInvitations
  } catch (error) {
    throw error
  }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation not found!')
    }

    const boardId = getInvitation.boardInvitation.boardId.toString()
    const getBoard = await boardModel.findOneById(boardId)
    if (!getBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const boardOwnerAndMemberIds = [
      ...getBoard.ownerIds,
      ...getBoard.memberIds
    ].toString()

    if (
      status === BOARD_INVITATION_STATUS.ACCEPTED &&
      boardOwnerAndMemberIds.includes(userId)
    ) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        'You are already member of this board!'
      )
    }

    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status
      }
    }

    const updatedInvitation = await invitationModel.update(
      invitationId.toString(),
      updateData
    )
    console.log(updateBoardInvitation)

    if (
      updatedInvitation.boardInvitation.status ===
      BOARD_INVITATION_STATUS.ACCEPTED
    ) {
      const result = await boardModel.pushMemberIds(boardId, userId)
      console.log(result)
    }

    return updatedInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}
