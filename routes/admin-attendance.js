var express = require('express');
var router = express.Router();
const Attendance = require('../schema/attendance.schema');


router.get('/', async function (req, res, next) {
  console.log('req.query: ', req.query);

  const filter = {
    state: '출근'
  }

  const options = {
    page: +req.query.page,
    limit: +req.query.limit,
    lean: true,
    populate: {
      path: 'userId',
      populate: {
        path: 'department',
      }
    },
  }
  const attendance = await Attendance.paginate(filter, options)

  const newDocList = await Promise.all(attendance.docs.map(async (ele) => {
    const found = await Attendance.findOne({ _id: { $gt: ele._id } })
    if (found?.state === '퇴근') ele.leave = found?.toJSON()
    return ele
  }))

  attendance.docs = newDocList

  res.json(attendance)

})

module.exports = router;