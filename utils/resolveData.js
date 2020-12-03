const { getServerTime } = require('./dayGet')
const resolveSuccessData = (res, dataInfo = {}, dataMsg = 'ok') => {
  res.status(200).send({
    code: 200,
    message: dataMsg,
    serverTime: getServerTime(),
    data: dataInfo
  })
}

const resolveErrorData = (res, dataMsg = 'error', dataCode = 400) => {
  res.status(dataCode).send({
    code: dataCode,
    message: dataMsg,
    serverTime: getServerTime(),
    data: {}
  })
}

const resolveSystemError = res => {
  res.status(500).send({
    code: 500,
    message: '服务器内部错误',
    serverTime: getServerTime(),
    data: {}
  })
}

module.exports = {
  resolveSuccessData,
  resolveErrorData,
  resolveSystemError
}