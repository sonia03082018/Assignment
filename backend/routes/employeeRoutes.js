const express = require('express')
const router = express.Router()
const employeeController = require("../controllers/employeeController")
const Employee = require("../models/Employee")

router.post('/add-emp', employeeController.createEmployee)
router.get('/allemployees', employeeController.getEmployees)
router.get('/employee/:id', employeeController.singleEmployee)
router.put('/update/:id', employeeController.updateEmployee)
router.delete('/delete/:id', employeeController.deleteEmployee)

module.exports = router