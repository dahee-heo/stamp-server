const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const AttendanceSchema = new mongoose.Schema({
  attendance: String,
})
AttendanceSchema.plugin(mongoosePaginate)

const Attendance = mongoose.model('Attendance', AttendanceSchema)

module.exports = Attendance