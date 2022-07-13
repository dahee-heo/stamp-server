const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const DepartmentSchema = new mongoose.Schema({
  department: String,
})
DepartmentSchema.plugin(mongoosePaginate)

const Department = mongoose.model('Department', DepartmentSchema)

module.exports = Department 