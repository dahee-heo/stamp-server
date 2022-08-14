const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  password: String,
  role: String,
  //ADMIN | EMPLOYEE
})
UserSchema.plugin(mongoosePaginate)


const User = mongoose.model('User', UserSchema)

module.exports = User