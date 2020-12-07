const { isString } = require('lodash')
const { ThrowError, ErrorCode }  = require('../../utils/throwError')

exports.checkUsername = val => {
  if (isString(val) && /^[a-z0-9_-]{3,16}$/.test(val)) return true
  else throw new ThrowError(ErrorCode.param, { message: '用户名格式不正确', status: 400 })
}

exports.checkPassword = val => {
  if (isString && !(/\s+/g).test(val) &&  /^.{6,}$/.test(val)) return true
  else throw new ThrowError(ErrorCode.param, { message: '密码格式不正确', status: 400 })
}
