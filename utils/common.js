const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secretOrPrivateKey, refreshKey } = require('../config')

function md5hex (code) {
	return crypto.createHash('md5')
		.update(code)
		.digest('hex')
}

function getAccessToken (info = {}) {
	return jwt.sign(info, secretOrPrivateKey)
}

function getRefreshToken(info = {}) {
  return jwt.sign(info, refreshKey)
}

module.exports = {
  md5hex,
  getAccessToken,
  getRefreshToken
}
