const router = require('express').Router()
const formidable = require('formidable')
const path = require('path')
const { resolveSuccessData, getServerTime } = require('../utils')
const { ThrowError, ErrorCode } = require('../utils/throwError')
const { uploadPath, uploadUrl } = require('../config')
const imageModel = require('../model/imageModel')
const mongoID = require('mongodb').ObjectID

router.route('/v1/image').post(async (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = uploadPath
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw err
      const fileItem = files.file
      if (!fileItem) throw new ThrowError(ErrorCode.param, { message: '上传内容为空', status: 400 })
      const newFileName = new mongoID()
      const extname = path.extname(fileItem.name)
      const newItem = await (new imageModel({
        imageName: newFileName,
        imagePath: fileItem.path,
        imageUrl: `${uploadUrl}/${newFileName}${extname}`,
        createTime: getServerTime()
      })).save()
      resolveSuccessData(res, { url: newItem.imageUrl })
    } catch (error) {
      next(error)
    }
  })
})

router.route('/v1/image').get(async (req, res, next) => {
  try {
    const { page = 1, size = 10, name = '' } = req.query
    const resData = await imageModel.get_pagination_image(page, size, name)
    resolveSuccessData(res, resData)
  } catch (error) {
    next(error)
  }
})

module.exports = router