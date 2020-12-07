const dayjs = require('dayjs')

const getServerTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

const getExpTime = (exp) => {
  return parseInt((new Date()).valueOf() / 1000) + exp
}

module.exports = {
  getServerTime,
  getExpTime
}