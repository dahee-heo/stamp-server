var express = require('express');
var router = express.Router();
const Notice = require('../schema/notice.schema');


router.post('/', async function (req, res, next) {
  console.log('@@@@@@notice req.body: ', req.body);
  const params = {
    userId: req.userInfo._id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
  }
  const newNocice = new Notice(params)
  console.log('newNocice: ', newNocice);
  const saveRes = await newNocice.save()
  res.json(saveRes)
})

router.get('/', async function (req, res, next) {

  const options = {
    page: +req.query.page,
    limit: +req.query.limit,
    populate: {
      path: 'userId',
      populate: {
        path: 'name',
      }
    },
    sort: { datetime: -1 }
  }

  const notice = await Notice.paginate({}, options)
  res.json(notice)
})

router.delete('/:id', async function (req, res, next) {
  const noticeDelete = await Notice.deleteOne({ _id: req.params.id })
  res.json(noticeDelete)
})

router.get('/:id', async function (req, res, next) {
  const newNotice = await Notice.findOne({ _id: req.params.id})
  res.json(newNotice)
  // await newNotice.save()
})


module.exports = router;