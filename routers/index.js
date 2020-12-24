const common = require('./common')
const tag = require('./tag')
const image = require('./image')
const article = require('./article')
const blog = require('express').Router()

blog.use([tag, image, article])
module.exports = {
  common,
  blog
}