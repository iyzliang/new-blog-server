const { isArray } = require('lodash')

module.exports = (obj = {}, checkKey = []) => {
  const checkOver = []
  if (isArray(checkKey)) {
    checkKey.forEach(item => {
      if (!obj[item]) {
        checkOver.push(item)
      }
    })
  }
  return checkOver
}