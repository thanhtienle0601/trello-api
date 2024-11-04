import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE
} from '~/utils/validators'

// Function to check file type with Multer
const customFileFilter = (req, file, callback) => {
  console.log('Multer file: ', file)

  // With Multer check file type by mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage),
      false
    )
  }

  // If file is valid, accept it
  return callback(null, true)
}

// Multer upload configuration
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE }, // 10MB
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
