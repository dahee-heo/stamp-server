const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const secretKey = 'stamp-access-secret-key'

const salt = 10
const encrypt = (pw) => {
  const hash = bcrypt.hashSync(pw, salt)
  return hash
}

const pwCompare = (pw, hash) => {
  console.log('pw: ', pw);
  console.log('hash: ', hash);
  const match = bcrypt.compareSync(pw, hash);
  return match
}

const getToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 * 24 })
  return token
}

const verify = (token) => {
  const decoded = jwt.verify(token, secretKey)
  return decoded
}


module.exports = { encrypt, pwCompare, getToken, verify }