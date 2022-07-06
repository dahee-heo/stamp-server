var express = require('express');
var router = express.Router();
const Department = require('../schema/department.schema');


router.post('/', async function (req, res, next) {
  const newDepartment = new Department({
    department: req.body.department,
  })
  // await newDepartment.save()

  Department.findOne({ department: req.body.department }, (err, result) => {
    if (!result) {
      newDepartment.save()
    }
  })
})

router.get('/', async function (req, res, next) {
  const newDepartment = new Department({
    department: req.body.department,
  })
  const department = await Department.find().select('department')
  res.json(department)

})

router.get('/:id', async function (req, res, next) {
  const newDepartment = new Department({
    department: req.params.id,
  })

  await newDepartment.save()
  console.log(req.body)
})


module.exports = router;