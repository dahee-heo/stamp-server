const RoleMap = {
  ADMIN: ['ADMIN'],
  EMPLOYEE: ['ADMIN', 'EMPLOYEE']
}

const roleMiddlewareMixin = function (role) {

  const ableRoleList = RoleMap[role] ?? []

  return function (req, res, next) {

    if (!req?.userInfo) {
      console.log('AUTHORIZATION_FAIL!!!');
      console.log('req?.userInfo: ', req?.userInfo);
      res.status(401).json({ stateMessage: 'AUTHORIZATION_FAIL' })
    } else if (!ableRoleList.includes(req?.userInfo?.role)) {
      res.status(403).json({ stateMessage: 'FORBIDDEN' })
    } else {
      console.log('ROLE CHECKER WORK :::', req.userInfo)
      next()
    }
  }
}

module.exports = roleMiddlewareMixin