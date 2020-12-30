const fs = require('fs')
const path = require('path')

const accessLogStream = fs.createWriteStream(process.env.logPath), {flags: 'a'})

module.exports = accessLogStream
