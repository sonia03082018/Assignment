const Employee = require('../models/Employee')

const createEmployee = async (req, res) => {
    try {
        const { name, email, designation, salary } = req.body

        const employee = new Employee({
            name,
            email,
            designation,
            salary
        })
        await employee.save()
        res.status(201).json(employee)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const getEmployees = async (req, res) => {
    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";

        let query = {};
    if(search.trim() !== ""){
         query={
            $or: [
                { name: {$regex: search, $options: "i"}},
                {designation: {$regex: search, $options: "i"}}
            ],
        };
    }   
    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
    .skip((page - 1) * limit)
    .limit(limit);
    res.status(200).json({
        total,
        employees,
        totalPages: Math.ceil(total/limit),
        currentPage: page
    });

        // const employees = await Employee.find()
        // res.status(200).json(employees)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const singleEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)

        if (!employee) {
            return res.status(404).json({ message: `Employee not found` })
        }

        res.status(200).json(employee)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { name, email, designation, salary } = req.body

        const myEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, designation, salary }
        )
        if (!myEmployee) {
            return res.status(404).json({ message: `Employee not found` })
        }
        res.status(200).json(myEmployee)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const deleteEmployee = async (req, res) => {
    try{
        const deleteEmployee = await Employee.findByIdAndDelete(req.params.id)
         if (!deleteEmployee) {
            return res.status(404).json({ message: `Employee not found` })
        }
        res.status(204).send()
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

module.exports = { createEmployee, getEmployees, singleEmployee, updateEmployee, deleteEmployee }