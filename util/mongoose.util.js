const mongoose = require('mongoose')

const mongooseInit = async () => {
  return await mongoose.connect('mongodb://localhost:27017/stamp')
}

module.exports = {
  mongooseInit
}