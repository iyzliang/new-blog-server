const { isString, trimStart } = require('lodash')
const { ThrowError, ErrorCode }  = require('../../utils/throwError')

const haveSpace = val => {
  return /\s/g.test(val)
}

exports.checkUsername = val => {
  if (isString(val) && /^[a-z0-9_-]{3,16}$/.test(val)) return true
  else throw new ThrowError(ErrorCode.param, { message: '用户名格式不正确', status: 400 })
}

exports.checkPassword = val => {
  if (isString(val) && !haveSpace(val) &&  /^.{6,}$/.test(val)) return true
  else throw new ThrowError(ErrorCode.param, { message: '密码格式不正确', status: 400 })
}

exports.checkTagName = val => {
  if (isString(val) && trimStart(val).length > 0) return true
  else throw new ThrowError(ErrorCode.param, { message: '标签格式不正确', status: 400 })
}
