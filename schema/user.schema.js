const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  id: String,
  department: String,
  password: String,
})

const User = mongoose.model('User', UserSchema)

module.exports = User