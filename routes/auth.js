var express = require('express');
var router = express.Router();
const User = require('../schema/user.schema')
const Attendance = require('../schema/attendance.schema')
const { encrypt, pwCompare, getToken, verify } = require('../util/auth.util')

router.get('/session-verify', async function (req, res, next) {
  if (req?.cookies?.token) {
    const token = req?.cookies?.token
    const userInfo = verify(token)
    console.log('userInfo: ', userInfo);
    const state = await Attendance.findOne({ userId: userInfo._id }).sort({ datetime: -1 })
    console.log('state: ', state);
    res.json({ ...userInfo, token, state })
  } else {
    res.status(401).json({ statusMessage: 'NOT_AUTHORIZITION' })
  }
})

router.post('/login', async function (req, res, next) {

  console.log('req.body: ', req.body);
  const findUser = await User.findOne({ id: req.body.id })

  if (!findUser) {
    console.log('user not found')
    res.status(401).json({ errorMessage: 'login fail' })
    return
  }//사용자 없을때
  if (!pwCompare(req.body.password, findUser.password)) {
    console.log('invalid password')
    res.status(401).json({ errorMessage: 'login fail' })
    return
  }//비밀번호 못찾을때

  const toJson = findUser.toJSON()
  delete toJson.password
  const token = getToken(toJson)
  const state = await Attendance.findOne({ userId: findUser._id }).sort({ datetime: -1 })

  res
    .cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 })
    .json({ ...toJson, token, state })

});



router.post('/sign-up', async function (req, res, next) {
  console.log('req: ', req.body);
  const newUser = new User({
    name: req.body.name,
    department: req.body.department,
    password: encrypt(req.body.password),
    id: null,
    role: req.body.role,
  })

  await newUser.save()
  newUser.set({ id: `${newUser.department}_${Date.now()}` })
  await newUser.save()

});



router.get('/logout', async function (req, res, next) {
  res.clearCookie('token').json({ statusMessage: 'done' })
})


router.put('/user-update', async function (req, res, next) {
  const userUpdate = await User.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name, department: req.body.department })
  res.json(userUpdate)
  console.log('userUpdate: ', userUpdate);
})


router.put('/myinfo-id-update', async function (req, res, next) {
  const myInfoUpdate = await User.findOneAndUpdate({ _id: req.body._id }, { id: req.body.id })
  res.json(myInfoUpdate)
})
router.put('/myinfo-pw-update', async function (req, res, next) {
  // console.log('req: ', req.body);

  const findUser = await User.findOne({ _id: req.body._id })
  console.log('findUser: ', findUser);

  if (!pwCompare(req.body.password, findUser.password)) {
    console.log('invalid password')
    res.status(401).json({ errorMessage: 'login fail' })
    return
  }
  // if (req.newPassword === req.passwordCheck) {
  // }
  const myInfoUpdate = await User.findOneAndUpdate({ _id: req.body._id }, { password: encrypt(req.body.newPassword) })
  res.json(myInfoUpdate)


})

router.delete('/:id', async function (req, res, next) {
  const employeeDelete = await User.deleteOne({ _id: req.params.id })
  res.json(employeeDelete)
})

module.exports = router;