/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/columnService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    //navigate to service
    const createColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createColumn)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id
    //navigate to service
    const updatedColumn = await columnService.update(columnId, req.body)
    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

const deleteColumnById = async (req, res, next) => {
  try {
    const columnId = req.params.id
    //navigate to service
    const result = await columnService.deleteColumnById(columnId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

export const columnController = {
  createNew,
  update,
  deleteColumnById
}
