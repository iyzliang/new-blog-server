const mongoose = require('mongoose')
const db = require('./db')

const idsScheam = new mongoose.Schema({
  model: String,
  count: Number
})

const IdsModel = db.model('Id', idsScheam)

module.exports = IdsModel
