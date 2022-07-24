var express = require('express');
var router = express.Router();
const User = require('../schema/user.schema')
const { encrypt, pwCompare, getToken, verify } = require('../util/auth.util')

router.get('/session-verify', async function (req, res, next) {
  if (req?.cookies?.token) {
    const token = req?.cookies?.token
    const userInfo = verify(token)
    res.json({ ...userInfo, token })
  } else {
    res.status(401).json({ statusMessage: 'NOT_AUTHORIZITION' })
  }
})

router.post('/login', async function (req, res, next) {

  console.log('req.body: ', req.body);
  const findUser = await User.findOne({ id: req.body.id })

  if (!findUser) {
    res.status(401).json({ errorMessage: 'login fail' })
    return
  }//사용자 없을때
  if (!pwCompare(req.body.password, findUser.password)) {
    res.status(401).json({ errorMessage: 'login fail' })
    return
  }//비밀번호 못찾을때

  const toJson = findUser.toJSON()
  delete toJson.password
  const token = getToken(toJson)
  toJson.token = token

  res
    .cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 })
    .json(toJson)

});



router.post('/sign-up', async function (req, res, next) {
  const newUser = new User({
    name: req.body.name,
    department: req.body.department,
    password: encrypt(req.body.password),
    id: null,
  })

  await newUser.save()
  newUser.set({ id: `${newUser.department}_${Date.now()}` })
  await newUser.save()


  console.log(req.body);
});



router.get('/', function (req, res, next) {
  res.json({
    msg: 'test'
  })
});

router.get('/logout', async function (req, res, next) {
  res.clearCookie().json({ statusMessage: 'done' })
})

module.exports = router;