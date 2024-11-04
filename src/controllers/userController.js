import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'

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

    // Xử lý trả về httpOnly cookies cho trình duyệt

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res
    //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //   .json({ errors: error.message })
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res
      .status(StatusCodes.OK)
      .json({ loggedOut: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'Unauthorized' })
    }

    const result = await userService.refreshToken(refreshToken)

    // Xử lý trả về httpOnly cookies cho trình duyệt
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In!'))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    console.log('🚀 ~ update ~ userAvatarFile:', userAvatarFile)

    //navigate to service
    const result = await userService.update(userId, req.body, userAvatarFile)
    // console.log(result)
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
  login,
  logout,
  refreshToken,
  update
}
