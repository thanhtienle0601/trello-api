import { ObjectId } from 'mongodb'
import { boardModel } from '~/models/boardModel'
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

export const columnService = {
  createNew
}
