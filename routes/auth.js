var express = require('express');
var router = express.Router();
const User = require('../schema/user.schema')
const { encrypt, pwCompare, getToken, verify } = require('../util/auth.util')

router.post('/login', async function (req, res, next) {

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
    .cookie('token', token, { domain: "http://localhost:3001", path: "/", maxAge: 90000 })
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
  newUser.set({ id: `${newUser.department}_${newUser._id.toString()}` })
  await newUser.save()


  console.log(req.body);
});



router.get('/', function (req, res, next) {
  res.json({
    msg: 'test'
  })
});


//signup 구현하기

module.exports = router;