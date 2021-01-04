const mongoose = require('mongoose')
const db = require('./db')
const { ThrowError, ErrorCode } = require('../utils/throwError.js')
const { getServerTime } = require('../utils/index')
const { uploadUrl } = require('../config')

const ImagesScheam = new mongoose.Schema({
  imageName: { type: String, default: '' },
  imagePath: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  createTime: { type: String, default: '' },
  status: { type: Boolean, default: true }
})

ImagesScheam.path('imageName').required(true, '图片名称不能为空')
ImagesScheam.path('imageUrl').required(true, '图片地址不能为空')

ImagesScheam.statics.get_pagination_image = async function (page, size, name) {
  const query = {
    imageName: { $regex: (new RegExp(name, 'i')) },
    status: true
  }
  const total = await this.countDocuments(query).exec()
  const dbData = await this.find(query).skip((page - 1) * 10).limit(size).exec()
  const resList = dbData.map(item => {
    return {
      name: item.imageName,
      url: `${uploadUrl}${item.imageUrl}`,
      createTime: item.createTime
    }
  })
  return {
    total,
    list: resList
  }
}

const ImagesModel = db.model('Image', ImagesScheam)

module.exports = ImagesModel
