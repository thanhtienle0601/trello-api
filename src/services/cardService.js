/* eslint-disable no-useless-catch */
import { ObjectId } from 'mongodb'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

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

const update = async (cardId, reqBody, cardCoverFile) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: new Date()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      // Update file to cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'covers'
      )
      console.log('🚀 ~ update ~ uploadResult:', uploadResult)

      // Save url of image file to database
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else {
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
