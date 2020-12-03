const idsModel = require('../idsModel')

module.exports = model => {
  return new Promise(async resolve => {
    const idItem = await idsModel.findOne({ model }).exec()
    if (idItem) {
      const newCount = idItem.count + 1
      await idsModel.updateOne(({ _id: idItem._id }), { count: newCount })
      resolve(newCount)
    } else {
      await (new idsModel({
        model,
        count: 0
      })).save()
      resolve(0)
    }
  })
}