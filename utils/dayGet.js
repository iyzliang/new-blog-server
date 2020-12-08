const dayjs = require('dayjs')

const getServerTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

const getExpTime = (exp) => {
  return parseInt((new Date()).valueOf() / 1000) + exp
}

const isExpired = (exp) => {
  if (exp && typeof exp === 'number') {
    return parseInt((new Date()).valueOf() / 1000) >= exp
  } else {
    return true
  }
}

module.exports = {
  getServerTime,
  getExpTime,
  isExpired
}