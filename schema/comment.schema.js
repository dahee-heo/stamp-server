const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const CommentSchema = new mongoose.Schema({
  content: String,
  date: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  noticeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice',
  },
})
CommentSchema.plugin(mongoosePaginate)
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment