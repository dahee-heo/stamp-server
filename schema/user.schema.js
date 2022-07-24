const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  department: String,
  password: String,
})
UserSchema.plugin(mongoosePaginate)


const User = mongoose.model('User', UserSchema)

module.exports = User