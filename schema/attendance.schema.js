const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const AttendanceSchema = new mongoose.Schema({
  datetime: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  state: String,
})
AttendanceSchema.plugin(mongoosePaginate)
const Attendance = mongoose.model('Attendance', AttendanceSchema)

module.exports = Attendance