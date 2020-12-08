const mongoose = require('mongoose')
const db = require('./db')
const idsModel = require('./idsModel')
const { ThrowError, ErrorCode } = require('../utils/throwError.js')
const { decodedToken, isExpired } = require('../utils')

const AccountScheam = new mongoose.Schema({
  username: { type: String, default: '' },
  password: { type: String, default: '' },
  userId: { type: Number, index: true },
  add_time: { type: String, default: '' },
  refreshToken: {
    token: { type: String, default: '' },
    expiresIn: { type: Number }
  }
})

AccountScheam.path('username').required(true, '用户名不能为空').validate(/^[a-z0-9_-]{3,16}$/, '用户名格式不正确')
AccountScheam.path('password').required(true, '密码不能为空')
AccountScheam.path('userId').required(true, '用户ID不能为空')

AccountScheam.statics.check_and_save = async function (info) {
  try {
    const accountItem = await this.findOne({ username: info.username }).exec()
    if (accountItem) {
      throw new ThrowError(ErrorCode.param, { message: '用户名已存在', status: 400 })
    } else {
      const userId = await idsModel.get_id_by_model('userId')
      const newItem = await (new this({
        ...info,
        userId
      })).save()
      return newItem
    }
  } catch (error) {
    throw error
  }
}
AccountScheam.statics.find_by_username = async function (username) {
  try {
    const accountItem = await this.findOne({ username }).exec()
    if (accountItem) {
      return accountItem
    } else {
      throw new ThrowError(ErrorCode.param, { message: '用户不存在', status: 400 })
    }
  } catch (error) {
    throw error
  }
}
AccountScheam.statics.check_refresh_token = async function (refresh) {
  try {
    const tokenJson = decodedToken(refresh)
    const { refreshToken, userId } = await this.findOne({ userId: tokenJson.userId }).exec()
    if (refreshToken.token && !isExpired(refreshToken.expiresIn)) {
      return userId
    } else {
      throw new ThrowError(ErrorCode.bad, { message: '刷新凭证已过期', status: 401 })
    }
  } catch (error) {
    throw error
  }
}

const AccountModel = db.model('Account', AccountScheam)

module.exports = AccountModel