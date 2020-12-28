const router = require('express').Router()
const { ThrowError, ErrorCode }  = require('../utils/throwError')
const { resolveSuccessData, getServerTime } = require('../utils')
const articleModel = require('../model/articleModel')
const idsModel = require('../model/idsModel')
const tagModel = require('../model/tagModel')

router.route('/v1/article').post(async (req, res, next) => {
  try {
    const { title, description, tags, cover, article } = req.body
    const userId = req.user.userId
    if (!title) throw new ThrowError(ErrorCode.param, { message: '文章标题不能为空', status: 400 })
    const articleId = await idsModel.get_id_by_model('articleId')
    const options = {
      articleId,
      title: title,
      article: article || '',
      description: description || '',
      tags: tags || [],
      cover: cover || '',
      createTime: getServerTime(),
      updateTime: getServerTime(),
      userId
    }
    if (options.tags.length) {
      const orQuery = options.tags.map(item => {
        return {
          tagId: item
        }
      })
      const dbTag = await tagModel.find({ $or: orQuery })
      options.tags = dbTag.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        }
      })
    }
    const newItem = await (new articleModel(options)).save()
    resolveSuccessData(res, {
      id: newItem.articleId,
      title: newItem.title,
      description: newItem.description,
      tags: newItem.tags,
      cover: newItem.cover,
      article: newItem.article,
      createTime: newItem.createTime,
      updateTime: newItem.updateTime
    })
  } catch (error) {
    next(error)
  }
})

router.route('/v1/article').get(async (req, res, next) => {
  try {
    const { page, size, title, description, tagId } = req.query
    const resData = await articleModel.list({
      page: parseInt(page),
      size: parseInt(size),
      title,
      description,
      tagId
    })
    resolveSuccessData(res, resData)
  } catch (error) {
    next(error)
  }
})

router.route('/v1/article/:articleId').put(async (req, res, next) => {
  try {
    const { articleId } = req.params
    const { title, description, tags, cover, article } = req.body
    if (!articleId) throw new ThrowError(ErrorCode.param, { message: '文章ID不能为空', status: 400 })
    if (!title) throw new ThrowError(ErrorCode.param, { message: '文章标题不能为空', status: 400 })
    const options = {
      title: title,
      article: article || '',
      description: description || '',
      tags: tags || [],
      cover: cover || '',
      updateTime: getServerTime()
    }
    if (options.tags.length) {
      const orQuery = options.tags.map(item => {
        return {
          tagId: item
        }
      })
      const dbTag = await tagModel.find({ $or: orQuery })
      options.tags = dbTag.map(item => {
        return {
          id: item.tagId,
          name: item.tagName
        }
      })
    }
    const newItem = await articleModel.findOneAndUpdate({ articleId }, options, { new: true }).exec()
    resolveSuccessData(res, {
      id: newItem.articleId,
      title: newItem.title,
      description: newItem.description,
      tags: newItem.tags,
      cover: newItem.cover,
      article: newItem.article,
      createTime: newItem.createTime,
      updateTime: newItem.updateTime
    })
  } catch (error) {
    next(error)
  }
})
router.route('/v1/article/:articleId').get(async (req, res, next) => {
  try {
    const { articleId } = req.params
    if (!articleId) throw new ThrowError(ErrorCode.param, { message: '文章ID不能为空', status: 400 })
    const newItem = await articleModel.findOne({ articleId }).exec()
    if (!newItem) throw new ThrowError(ErrorCode.param, { message: '文章ID不存在', status: 400 })
    resolveSuccessData(res, {
      id: newItem.articleId,
      title: newItem.title,
      description: newItem.description,
      tags: newItem.tags,
      cover: newItem.cover,
      article: newItem.article,
      createTime: newItem.createTime,
      updateTime: newItem.updateTime
    })
  } catch (error) {
    next(error)
  }
})
router.route('/v1/article/:articleId').delete(async (req, res, next) => {
  try {
    const { articleId } = req.params
    if (!articleId) throw new ThrowError(ErrorCode.param, { message: '文章ID不能为空', status: 400 })
    await articleModel.findOneAndDelete({ articleId }).exec()
    resolveSuccessData(res)
  } catch (error) {
    next(error)
  }
})
module.exports = router