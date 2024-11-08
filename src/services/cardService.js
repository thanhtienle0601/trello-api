/* eslint-disable no-useless-catch */
import { ObjectId } from 'mongodb'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

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
    const result = await cardModel.findOneById(
      (await cardModel.createOne(data)).insertedId.toString()
    )

    if (result) {
      await columnModel.pushCardOrderIds(result)
    }

    return result
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  try {
    const updateDate = {
      ...reqBody,
      updatedAt: new Date()
    }
    const updatedCard = await cardModel.update(cardId, updateDate)

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
