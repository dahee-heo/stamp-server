const authMiddleware = function (req, res, next) {

  if (!req?.userInfo) {
    res.status(401).json({
      stateMessage: 'AUTHORIZATION_FAIL'
    })
  } else {
    console.log(res.userInfo)
    next()
  }
};

module.exports = authMiddleware