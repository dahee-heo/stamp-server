var express = require('express');
var router = express.Router();
const User = require('../schema/user.schema');


/* GET users listing. */
router.get('/', async function (req, res, next) {
  console.log('req: ', req.userInfo);
  // res.json({
  //   msg: 'test'
  // })
  const newUser = new User({
    _id: req.body._id,
  })

  const user = await User.find({})
  // console.log('user: ', user);
  // const findModifyUser = await User.findOne({ _id: req.userInfo._id })
  // if (findModifyUser) {
  //   res.json(findModifyUser)
  //   return
  // }

  const options = {
    page: +req.query.page,
    limit: +req.query.limit,
  }
  const userPage = await User.paginate({}, options)
  // console.log('department: ', department);

  res.json(userPage)

});

router.put('/', async function (req, res, next) {
  const nameUpdate = await User.findOneAndUpdate({ id: req.userInfo.id }, { name: req.userInfo.name })
  res.json(nameUpdate)
})




// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
