import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    //navigate to service
    const createUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}
const verifyAccount = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    //navigate to service
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}
const login = async (req, res, next) => {
  try {
    // console.log('req.body: ', req.body)

    //navigate to service
    const result = await userService.login(req.body)
    // Xử lý trả về httpOnly coolies cho trình duyệt
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}
