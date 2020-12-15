const router = require('express').Router()
const { ThrowError, ErrorCode }  = require('../utils/throwError')
const tagModel = require('../model/tagModel')
const { checkTagName } = require('./utils/check')
const { resolveSuccessData } = require('../utils')

router.route('/v1/tag').post(async (req, res, next) => {
  try {
    const { tagName } = req.body
    checkTagName(tagName)
    const newTag = await tagModel.check_and_save(tagName)
    resolveSuccessData(res)
  } catch (error) {
    next(error)
  }
})

router.route('/v1/tag').get(async (req, res, next) => {
  try {
    const { tagName } = req.query
    const query = {
      tagName: { $regex: (new RegExp(tagName, 'i')) }
    }
    const total = await tagModel.countDocuments(query).exec()
    const dbData = await tagModel.find(query).exec()
    const resList = []
    dbData.forEach(item => {
      resList.push({
        tagId: item.tagId,
        tagName: item.tagName,
        createTime: item.createTime,
        status: item.status
      })
    })
    resolveSuccessData(res, {
      total,
      list: resList
    })
  } catch (error) {
    next(error)
  }
})

router.route('/v1/tag/:tagId').put(async (req, res, next) => {
  try {
    const { tagId } = req.params
    const { tagName } = req.body
    checkTagName(tagName)
    const dbItem = await tagModel.check_and_update(tagId, tagName)
    resolveSuccessData(res, {
      tagId: dbItem.tagId,
      tagName: dbItem.tagName,
      createTime: dbItem.createTime,
      status: dbItem.status
    })
  } catch (error) {
    next(error)
  }
})

router.route('/v1/tag/:tagId').delete(async (req, res, next) => {
  try {
    const { tagId } = req.params
    await tagModel.deleteOne({ tagId }).exec()
    resolveSuccessData(res)
  } catch (error) {
    next(error)
  }
})
module.exports = router