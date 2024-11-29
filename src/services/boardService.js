/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_ITEM_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (userId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = { ...reqBody, slug: slugify(reqBody.title) }

    return await boardModel.findOneById(
      (await boardModel.createOne(userId, data)).insertedId.toString()
    )
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found !')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach((col) => {
      col.cards = resBoard.cards.filter((card) => card.columnId.equals(col._id))
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const result = await boardModel.update(boardId, updateData)
    return result
  } catch (error) {
    throw error
  }
}

const moveCardDifferenceColumns = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //B1 Update oldColumnCardOrderIds
    await columnModel.update(reqBody.oldColumnId, {
      cardOrderIds: reqBody.oldColumnCardOrderIds,
      updatedAt: Date.now()
    })
    //B2 Update newColumnCardOrderIds
    await columnModel.update(reqBody.newColumnId, {
      cardOrderIds: reqBody.newColumnCardOrderIds,
      updatedAt: Date.now()
    })
    //B3 update columnId of moved card
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.newColumnId,
      updatedAt: Date.now()
    })

    return { status: 'success' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEM_PER_PAGE

    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10),
      queryFilters
    )

    return results
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardDifferenceColumns,
  getBoards
}
