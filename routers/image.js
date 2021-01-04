const router = require('express').Router()
const formidable = require('formidable')
const path = require('path')
const fs = require('fs').promises
const { resolveSuccessData, getServerTime } = require('../utils')
const { ThrowError, ErrorCode } = require('../utils/throwError')
const { uploadPath } = require('../config')
const imageModel = require('../model/imageModel')
const mongoID = require('mongodb').ObjectID
const { isFinite } = require('lodash')

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
      await fs.rename(fileItem.path, `${uploadPath}/${newFileName}${extname}`)
      const newItem = await (new imageModel({
        imageName: newFileName,
        imagePath: fileItem.path,
        imageUrl: `/${newFileName}${extname}`,
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
    let { page, size, name } = req.query
    page = (isFinite(parseInt(page)) && parseInt(page) > 0) ? parseInt(page) : 1
    size = (isFinite(parseInt(size)) && parseInt(size) > 0) ? parseInt(size) : 10
    const resData = await imageModel.get_pagination_image(page, size, name)
    resolveSuccessData(res, resData)
  } catch (error) {
    next(error)
  }
})

router.route('/v1/image').delete(async (req, res, next) => {
  try {
    const { name } = req.body
    const itme = await imageModel.updateOne({ imageName: name }, { status: false })
    resolveSuccessData(res)
  } catch (error) {
    next(error)
  }
})

module.exports = router