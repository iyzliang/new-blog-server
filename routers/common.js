const router = require('express').Router()
const { ThrowError, ErrorCode }  = require('../utils/throwError')
const { resolveSuccessData, getServerTime, md5hex, getExpTime, getAccessToken, getRefreshToken } = require('../utils')
const { checkUsername, checkPassword } = require('./utils/check.js')
const accountModel = require('../model/accountModel')

/**
 * 注册接口
 * @param {String} username 用户名
 * @param {String} password 用户密码
 */
router.route('/v1/register').post(async (req, res, next) => {
  try {
    const { username, password } = req.body
    checkUsername(username)
    checkPassword(password)
    const accountData = await accountModel.check_and_save({
      username,
      password: md5hex(password),
      add_time: getServerTime()
    })
    resolveSuccessData(res)
  } catch (error) {
    next(error)
  }
})

router.route('/v1/login').post(async (req, res, next) => {
  try {
    const { username, password } = req.body
    checkUsername(username)
    checkPassword(password)
    const { userId, password: accessPassword } = await accountModel.find_by_username(username)
    if (accessPassword === md5hex(password)) {
      const accessExp = getExpTime(60 * 60)
      const refreshExp = getExpTime(60 * 60 * 48)
      const accessToken = getAccessToken({
        userId,
        exp: accessExp
      })
      const refreshToken = getRefreshToken({
        userId,
        exp: refreshExp
      })
      await accountModel.updateOne({ userId }, {
        refreshToken: {
          token: refreshToken,
          expiresIn: refreshExp
        }
      }).exec()
      resolveSuccessData(res, {
        accessToken,
        refreshToken,
        expiresIn: accessExp,
        userId
      })
    } else {
      throw new ThrowError(ErrorCode.param, { message: '登录密码错误', status: 400 })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router