import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const data = { ...reqBody, slug: slugify(reqBody.title) }

    return await boardModel.findOneById(
      (await boardModel.createOne(data)).insertedId.toString()
    )
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew
}
