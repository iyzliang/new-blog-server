const mongoose = require('mongoose')
const db = require('./db')

/**
 * @param articleId 文章id
 * @param title 文章标题
 * @param description 文章描述
 * @param tags 标签
 * @param cover 文章封面
 * @param article 文章内容
 * @param createTime 创建时间
 * @param updateTime 最后修改时间
 * @param status 状态
 * @param userId 用户id
 * @param numofviews 浏览次数
 */
const articleScheam = new mongoose.Schema({
  articleId: { type: Number },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: { type: Array, default: [] },
  cover: { type: String, default: '' },
  article: { type: String, default: '' },
  createTime: { type: String, default: '' },
  updateTime: { type: String, default: '' },
  status: { type: Boolean, default: false },
  userId: { type: Number },
  numofviews: { type: Number, default: 0 }
})

articleScheam.path('articleId').required(true, '文章ID不能为空')
articleScheam.path('title').required(true, '文章标题不能为空')
articleScheam.path('article').required(true, '文章内容不能为空')
articleScheam.path('userId').required(true, '用户ID不能为空')

articleScheam.statics = {
  list: async function (options) {
    let { page, size, title, description, tagId } = options
    page = page || 1
    size = size || 10
    const query = {
      title: { $regex: (new RegExp(title, 'i')) },
      description: { $regex: (new RegExp(description, 'i')) }
    }
    tagId && (query.tags = { $elemMatch: { tagId } })
    const total = await this.countDocuments(query).exec()
    const dbData =  await this.find(query).limit(size).skip(size * (page - 1)).exec()
    const list = dbData.map(item => {
      return {
        id: item.articleId,
        title: item.articleId,
        description: item.description,
        tags: item.tags,
        cover: item.cover,
        article: item.article,
        createTime: item.createTime,
        updateTime: item.updateTime,
        status: item.status,
        userId: item.userId,
        numofviews: item.numofviews
      }
    })
    return {
      total,
      list
    }
  }
}

const articleModel = db.model('Article', articleScheam)

module.exports = articleModel