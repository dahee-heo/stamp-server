var express = require('express');
var router = express.Router();
const Department = require('../schema/department.schema');


router.post('/', async function (req, res, next) {
  // await newDepartment.save()
  const departmentFind = await Department.findOne({ department: req.body.department })
  if (departmentFind) {
    res.json(departmentFind)
    return
  }

  const newDepartment = new Department({
    department: req.body.department,
  })

  const departmentSave = await newDepartment.save()
  res.json(departmentSave)
})

router.get('/', async function (req, res, next) {
  const newDepartment = new Department({
    department: req.body.department,
  })
  const department = await Department.find().select('department')
  res.json(department)

})

router.put('/', async function (req, res, next) {
  const departmentUpdate = await Department.findOneAndUpdate({ _id: req.body._id }, { department: req.body.department })
  res.json(departmentUpdate)
  console.log(departmentUpdate)


})

router.delete('/', async function (req, res, next) {
  const departmentDelete = await Department.deleteOne({ _id: req.body._id })
  res.json(departmentDelete)
})

router.get('/:id', async function (req, res, next) {
  const newDepartment = new Department({
    department: req.params.id,
  })

  await newDepartment.save()
  console.log(req.body)
})


module.exports = router;