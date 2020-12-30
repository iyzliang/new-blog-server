const fs = require('fs')
const path = require('path')

const accessLogStream = fs.createWriteStream(path.join(__dirname, `../../log/${process.env.logName}`), {flags: 'a'})

module.exports = accessLogStream
