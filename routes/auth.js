var express = require('express');
var router = express.Router();
const User = require('../schema/user.schema')

router.post('/login', function (req, res, next) {
  // console.log(req.body);
  res.json({
    msg: 'test'
  })
});

router.post('/sign-up', async function (req, res, next) {
  const newUser = new User({
    name: req.body.name,
    department: req.body.department,
    password: req.body.password,
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