const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema({
  department: String,
})

const Department = mongoose.model('Department', DepartmentSchema)

module.exports = Department 