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

module.exports = {
  resolveSuccessData,
  resolveErrorData
}