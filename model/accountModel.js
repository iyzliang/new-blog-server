const mongoose = require('mongoose')
const db = require('./db')

const accountScheam = new mongoose.Schema({
  username: String,
  password: String,
  userId: Number,
  add_time: Date
})

accountScheam.static.find_by_username = username => {
  return this.findOne({ username }).exec()
}

const accountModel = db.model('Account', accountScheam)

module.exports = accountModel