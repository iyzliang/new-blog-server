const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const routers = require('./routers')
const { secretOrPrivateKey, jwtUnlessPath } = require('./config')
const { resolveErrorData, getServerTime, getIPAddress, accessLogStream } = require('./utils')
const { common } = require('./routers/index')
const app = express()

morgan.token('localDate',function getDate(req) {
  return getServerTime()
})
morgan.format('blogLog', ':remote-addr - :remote-user [:localDate]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

app.use(cors())
app.use(morgan('blogLog', {stream: accessLogStream}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use('/api', expressJwt({
  secret: secretOrPrivateKey,
  algorithms: ['HS256']
}).unless({
  path: jwtUnlessPath
}))

app.use((error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    let msg = ''
    switch (error.message) {
      case 'jwt expired':
        msg = 'token信息已过期'
        break;
      case 'invalid signature':
        msg = 'token信息无效'
        break;
      default:
        msg = 'token信息错误'
        break;
    }
    resolveErrorData(res, msg, 401)
  } else {
    next()
  }
})

app.use('/api/common', common)

app.use((error, req, res, next) => {
  resolveErrorData(res, '未找到请求资源', 404)
})

app.listen(3001, () => {
  console.log(`--> ${getServerTime()} http://${getIPAddress()}:3001`)
})
