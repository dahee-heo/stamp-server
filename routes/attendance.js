var express = require('express');
var router = express.Router();
const Attendance = require('../schema/attendance.schema');

router.post('/', async function (req, res, next) {
  console.log('req.body: ', req.body);
  const params = {
    userId: req.userInfo._id,
    datetime: req.body.datetime + '',
    state: req.body.state
  }
  const newAttendance = new Attendance(params)

  const saveRes = await newAttendance.save()
  console.log('saveRes: ', saveRes);

  res.json(saveRes)
})

router.get('/', async function (req, res, next) {

  const options = {
    page: +req.query.page,
    limit: +req.query.limit,
  }

  let query = {}

  if (req?.query?.type) {
    query = {
      ...query,
      state: req.query.type
    }
  }

  if (req?.query?.start && req?.query?.end) {
    const start = new Date(req.query.start)
    const end = new Date(req.query.end)

    query = {
      ...query,
      datetime: { $gt: start.getTime(), $lt: end.getTime() },
    }
  }

  console.log('req?.query: ', req?.query);
  const attendance = await Attendance.paginate(query, options)
  console.log('query: ', query);
  console.log('attendance: ', attendance);
  res.json(attendance)
})

router.get('/state', async function (req, res, next) {
  console.log('req: ', req.userInfo);

  const attendanceState = await Attendance.findOne({ _id: req.userInfo._id })
  res.json(attendanceState)
})

module.exports = router;