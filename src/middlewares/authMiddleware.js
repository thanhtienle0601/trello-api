// middleware to verify the token
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment.js'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError.js'

const isAuthorized = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (No token found)')
    )
    return
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_SECRET_KEY
    )
    // console.log(accessTokenDecoded)
    req.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    // console.log('🚀 ~ isAuthorized ~ error:', error?.message)

    if (error?.message.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Unauthorized! (Token expired)'))
      return
    }

    next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (Invalid token)')
    )
  }
}

export const authMiddleware = { isAuthorized }
