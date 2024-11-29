import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'
import { Pipeline } from '@getbrevo/brevo'

const Joi = require('joi')

/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
const BOARD_COLLECTION_NAME = 'boards'
const BOARD__COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(250).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateData = async (data) => {
  return await BOARD__COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createOne = async (userId, data) => {
  try {
    const validData = await validateData(data)
    const newBoardToAdd = {
      ...validData,
      ownerIds: [ObjectId.createFromHexString(userId.toString())]
    }
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(newBoardToAdd)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const queryConditions = [
      { _id: ObjectId.createFromHexString(boardId.toString()) },
      {
        _destroy: false
      },
      {
        $or: [
          {
            ownerIds: {
              $all: [ObjectId.createFromHexString(userId.toString())]
            }
          },
          {
            memberIds: {
              $all: [ObjectId.createFromHexString(userId.toString())]
            }
          }
        ]
      }
    ]
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            $and: queryConditions
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'ownerIds',
            foreignField: '_id',
            as: 'owners',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: 'memberIds',
            foreignField: '_id',
            as: 'members',
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        }
      ])
      .toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

const pushColumnOrderIds = async (column) => {
  try {
    await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.isValid(column.boardId)
            ? column.boardId
            : ObjectId.createFromHexString(column.boardId)
        },
        {
          $push: {
            columnOrderIds: ObjectId.isValid(column._id)
              ? column._id
              : ObjectId.createFromHexString(column._id)
          }
        },
        { ReturnDocument: 'after' }
      )
  } catch (error) {
    throw new Error(error)
  }
}

const pullColumnOrderIds = async (column) => {
  try {
    await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.isValid(column.boardId)
            ? column.boardId
            : ObjectId.createFromHexString(column.boardId)
        },
        {
          $pull: {
            columnOrderIds: ObjectId.isValid(column._id)
              ? column._id
              : ObjectId.createFromHexString(column._id)
          }
        },
        { ReturnDocument: 'after' }
      )
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, updateData) => {
  try {
    Object.keys(updateData).forEach((field) => {
      if (INVALID_UPDATE_FIELDS.includes(field)) {
        delete updateData[field]
      }
    })
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map((_id) =>
        ObjectId.createFromHexString(_id)
      )
    }
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(boardId)
        },
        {
          $set: updateData
        },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    const queryConditions = [
      {
        _destroy: false
      },
      {
        $or: [
          {
            ownerIds: {
              $all: [ObjectId.createFromHexString(userId)]
            }
          },
          {
            memberIds: {
              $all: [ObjectId.createFromHexString(userId)]
            }
          }
        ]
      }
    ]

    if (queryFilters) {
      console.log(Object.keys(queryFilters))
      Object.keys(queryFilters).forEach((key) => {
        // queryConditions.push({ [key]: { $regex: queryFilters[key] } })
        queryConditions.push({
          [key]: { $regex: new RegExp(queryFilters[key], 'i') }
        })
      })
    }
    console.log(queryConditions)
    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          {
            $match: {
              $and: queryConditions
            }
          },
          { $sort: { title: 1 } },
          {
            $facet: {
              queryBoards: [
                { $skip: pagingSkipValue(page, itemsPerPage) },
                { $limit: itemsPerPage }
              ],
              queryTotalBoards: [
                {
                  $count: 'totalBoards'
                }
              ]
            }
          }
        ],
        { collation: { locale: 'en' } }
      )
      .toArray()
    const result = query[0]
    return {
      boards: result.queryBoards || [],
      totalBoards: result.queryTotalBoards[0]?.totalBoards || 0
    }
  } catch (error) {
    throw new Error(error)
  }
}

const pushMemberIds = async (boardId, memberId) => {
  try {
    await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(boardId.toString())
        },
        {
          $push: {
            memberIds: ObjectId.createFromHexString(memberId.toString())
          }
        },
        { returnDocument: 'after' }
      )
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD__COLLECTION_SCHEMA,
  createOne,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getBoards,
  pushMemberIds
}
