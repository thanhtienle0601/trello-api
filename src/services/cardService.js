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

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
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
      // console.log('🚀 ~ update ~ uploadResult:', uploadResult)

      // Save url of image file to database
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unShiftNewComment(cardId, commentData)
    } else if (updateData.incomingMemberInfo) {
      // Add or remove member from card
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateData.incomingMemberInfo
      )
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
