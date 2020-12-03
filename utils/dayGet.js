const dayjs = require('dayjs')

const getServerTime = () => {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

module.exports = {
  getServerTime
}