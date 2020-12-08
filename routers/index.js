const common = require('./common')
const tag = require('./tag')
const blog = require('express').Router()

blog.use([tag])
module.exports = {
  common,
  blog
}