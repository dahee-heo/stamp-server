var express = require('express');
var router = express.Router();
const fs = require('fs-extra')

const Notice = require('../schema/notice.schema');
const Comment = require('../schema/comment.schema');


router.post('/', async function (req, res, next) {
  const params = {
    userId: req.userInfo._id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
  }
  // const newNocice = new Notice(params)
  let newNocice = new Notice(params).save();
  const { _id: postId, userId, content } = newNocice;

  const oldPath = `./public/images/temp/${userId}`
  const newPath = `./public/images/temp/${postId}`

  !fs.existsSync(newPath) && fs.mkdirSync(newPath);

  const imgSrcReg = /(<img[^>]*src\s*=\s*[\"']?([^>\"']+)[\"']?[^>]*>)/g;

  while(imgSrcReg.test(content)){
    // let src = RegExp.$2.trim();
    const matchResult = content.match(imgSrcReg)
    let src = matchResult[2].trim();
    console.log('src: ', src);
    let imgName = src.substr(src.indexOf(userId) + userId.length + 1);
    let tmpImgPath = oldPath + `/${imgName}`;
    let postImgPath = newPath + `/${imgName}`;

    fs.existsSync(tmpImgPath) && fs.rename(tmpImgPath, postImgPath, (err) => {
      if(err) throw new Error(err);
      console.log('이미지 옮김 성공')
    })
  }

  const newContent = content.replaceAll(`temp/${userId}`, `posts/${postId}`)
  // const saveRes = await newNocice.save()
  newPost = await Notice.findOneAndUpdate({_id: postId}, {content: newContent})
  res.json(newPost)
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

router.patch('/:id/comment', async function (req, res, next) {
  console.log('req.body: ', req.body);
  const noticeCommentUpdate = await Comment.findOneAndUpdate({ _id: req.body.commentId }, { 
    content: req.body.content,
  })
  res.json(noticeCommentUpdate)
})

//이미지 파일 업로드 시
router.post('/file/:id', async function (req, res, next) {
  if(req.files.length > 0) {
    res.json(req.files[0])
  }
})

//업로드 취소 시 임시 파일 삭제
router.delete('/file/:id', async function (req, res, next) {
  const path = `./public/images/temp/${req.userInfo._id}`
  try {
    console.log('디렉토리 삭제')
    fs.existsSync(path) && fs.removeSync(path);
    res.json('디렉토리를 성공적으로 삭제하였습니다.')
  } catch (err) {
    throw new Error(err.message)
  }
})

module.exports = router;