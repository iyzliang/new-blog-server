const common = require('./common')
const tag = require('./tag')
const image = require('./image')
const blog = require('express').Router()

blog.use([tag, image])
module.exports = {
  common,
  blog
}