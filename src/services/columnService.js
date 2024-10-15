import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = {
      ...reqBody
    }
    const result = await columnModel.findOneById(
      (await columnModel.createOne(data)).insertedId.toString()
    )

    if (result) {
      result.cards = []
      await boardModel.pushColumnOrderIds(result)
    }

    return result
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const result = await columnModel.update(columnId, updateData)
    return result
  } catch (error) {
    throw error
  }
}

const deleteColumnById = async (columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No column is found !')
    }
    // Delete column
    await columnModel.deleteOneById(columnId)

    //Delete Cards by columnId
    await cardModel.deleteManyByColumnId(columnId)

    //Delete form columnOrderIds
    await boardModel.pullColumnOrderIds(targetColumn)
    return {
      status: 'success',
      message: 'Column and its Cards are deleted successfully !'
    }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteColumnById
}
