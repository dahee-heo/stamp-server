var express = require('express');
var router = express.Router();
const Attendance = require('../schema/attendance.schema');


router.get('/', async function (req, res, next) {
  console.log('req.query: ', req.query);

  const options = {
    page: +req.query.page,
    limit: +req.query.limit,
    populate: {
      path: 'userId',
      populate: {
        path: 'department',
      }
    },
  }
  const attendance = await Attendance.paginate({}, options)
  res.json(attendance)

})

module.exports = router;