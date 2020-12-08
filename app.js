const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const routers = require('./routers')
const { secretOrPrivateKey, jwtUnlessPath } = require('./config')
const { resolveErrorData, getServerTime, getIPAddress, accessLogStream } = require('./utils')
const { common, blog } = require('./routers/index')
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


app.use('/api/common', common)
app.use('/api/blog', blog)

app.use((req, res, next) => {
  resolveErrorData(res, '请求资源不存在', 404)
})

app.use((error, req, res, next) => {
  if (error.name === 'UnauthorizedError') {
    resolveErrorData(res, '会话超时，请重新登录', error.status || 401)
  } else if (error.name === 'YZLAppError') {
    resolveErrorData(res, error.message, error.status || 400)
  } else {
    console.log(error)
    resolveErrorData(res, '服务器内部错误', 500)
  }
})

app.listen(3001, () => {
  console.log(`--> ${getServerTime()} http://${getIPAddress()}:3001`)
})
