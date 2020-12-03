const { getServerTime } = require('./dayGet')
const { resolveSuccessData, resolveErrorData, resolveSystemError } = require('./resolveData')
const { getIPAddress } = require('./getIPAddress')
const accessLogStream = require('./accessLogStream')
const checkObjKey = require('./checkObjKey')

module.exports = {
  getServerTime,
  resolveSuccessData,
  resolveErrorData,
  resolveSystemError,
  getIPAddress,
  checkObjKey,
  accessLogStream
}