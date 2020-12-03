const router = require('express').Router()
const swt = require('jsonwebtoken')
const crypto = require('crypto')
const { resolveSuccessData, resolveErrorData, resolveSystemError, checkObjKey, getServerTime } = require('../utils')
const getId = require('../model/utils/getId')
const accountModel = require('../model/accountModel')

function md5hex (code) {
	return crypto.createHash('md5')
		.update(code)
		.digest('hex')
}

const modelRouter = router.all('/v1')

modelRouter.post('/register', (req, res) => {
  const check = checkObjKey(req.body, ['username', 'password'])
  if (check.length) {
    resolveErrorData(res, `缺失必传参数：${check.join(',')}`)
  } else {
    const { username, password } = req.body
    accountModel.find_by_username(username).then(userItem => {
      if (userItem) {
        resolveErrorData(res, '用户名已存在！', 400)
      } else {
        userId('userId').then(userId => {
          (new accountModel({
            username,
            password: md5hex(password),
            userId,
            add_time: getServerTime()
          })).save((err, saveRes) => {
            if (err) resolveSystemError
            resolveSuccessData(res)
          })
        })
      }
    }).catch(error => {
      resolveSystemError(res)
    })
  }
})

module.exports = modelRouter