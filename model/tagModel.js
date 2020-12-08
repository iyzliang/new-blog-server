const mongoose = require('mongoose')
const db = require('./db')
const idsModel = require('./idsModel')
const { ThrowError, ErrorCode } = require('../utils/throwError.js')
const { getServerTime } = require('../utils/index')

const TagsScheam = new mongoose.Schema({
  tagId: { type: Number },
  tagName: { type: String, default: '' },
  createTime: { type: String, default: '' },
  status: { type: Boolean, default: true }
})

TagsScheam.path('tagName').required(true, '标签名不能为空不能为空')
TagsScheam.path('tagId').required(true, '便签ID不能为空')

TagsScheam.statics.check_and_save = async function (tagName) {
  try {
    const tagItem = await this.findOne({ tagName }).exec()
    if (tagItem) {
      throw new ThrowError(ErrorCode.param, { message: '标签已存在', status: 400 })
    } else {
      const tagId = await idsModel.get_id_by_model('tagId')
      const newItem = await (new this({
        tagName,
        tagId,
        createTime: getServerTime()
      })).save()
      return newItem
    }
  } catch (error) {
    throw error
  }
}

const TagsModel = db.model('Tag', TagsScheam)

module.exports = TagsModel
