const mongoose = require('mongoose')
const config = require('../secret/config')

const mongooseInit = async () => {
  const mongoDBUrl = config[process.env.NODE_ENV]?.mongoDBOptions?.url ?? config?.LOCAL?.mongoDBOptions?.url
  return await mongoose.connect(mongoDBUrl)
}

module.exports = {
  mongooseInit
}