const { verify } = require('../util/auth.util')

const globalMiddleware = function (req, res, next) {
  try {

    if (req?.headers?.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      req.userInfo = verify(token)
      // console.log('req.userInfo: ', req.userInfo);
    }

    next()
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({
      statusMessage: 'UNCONTROLLED_ERROR'
    })

  }
};

module.exports = globalMiddleware