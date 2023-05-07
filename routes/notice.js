var express = require('express');
var router = express.Router();
const Notice = require('../schema/notice.schema');
const Comment = require('../schema/comment.schema');


router.post('/', async function (req, res, next) {
  const params = {
    userId: req.userInfo._id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
  }
  const newNocice = new Notice(params)
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

router.get('/:id', async function (req, res, next) {
  const newNotice = await Notice.findOne({ _id: req.params.id})
  res.json(newNotice)
  // await newNotice.save()
})

router.delete('/:id', async function (req, res, next) {
  const noticeDelete = await Notice.deleteOne({ _id: req.params.id })
  res.json(noticeDelete)
})

router.patch('/', async function (req, res, next) {
  const noticeUpdate = await Notice.findOneAndUpdate({ _id: req.body._id }, { 
    title: req.body.title,
    content: req.body.content,
  })
  res.json(noticeUpdate)
})

router.post('/:id/comment', async function (req, res, next) {
  const params = {
    userId: req.userInfo._id,
    content: req.body.content,
    date: req.body.date,
    noticeId: req.body.noticeId
  }
  const newComment = new Comment(params)
  console.log('newComment: ', newComment);
  const saveRes = await newComment.save()
  res.json(saveRes)
})

router.get('/:id/comment', async function (req, res, next) {
  const comment = await Comment.find({}).populate('userId')
  res.json(comment)
})


module.exports = router;