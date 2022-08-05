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
  const datetime = await Attendance.find({})
  res.json(datetime)
})

router.get('/state', async function (req, res, next) {
  console.log('req: ', req.userInfo);

  const attendanceState = await Attendance.findOne({ _id: req.userInfo._id })
  res.json(attendanceState)
})

module.exports = router;