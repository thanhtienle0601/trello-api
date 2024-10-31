/* eslint-disable no-empty */
import JWT from 'jsonwebtoken'
const generateToken = async (userInfo, secretKey, tokenLife) => {
  try {
    const token = JWT.sign(userInfo, secretKey, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
    return token
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretKey) => {
  try {
    return JWT.verify(token, secretKey)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
