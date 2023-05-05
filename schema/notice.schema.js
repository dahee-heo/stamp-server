const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const NoticeSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})
NoticeSchema.plugin(mongoosePaginate)
const Notice = mongoose.model('Notice', NoticeSchema)

module.exports = Notice