const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const { model } = require("mongoose");
const requireAuth = require("../middleware/auth");

router.get("/", requireAuth,async (req,res)=>{
    const employees=(await Employee.find()).toSorted({createdAt:-1}).toLocaleString();
    res.render("employees/index",{employees});
});

router.post("/employees", requireAuth,async (req,res)=>{
    try{
        const payload={
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            startDate: new Date(req.body.startDate),
            jobTitle: req.body.jobTitle,
            salary:Number(req.body.salary),
        }
        await Employee.create(payload);
        res.redirect("/");
    }catch(err){
        const employees=await Employee.find().sort({createdAt:-1}).lean();
        res.status(400).render("employees/index",{
            employees,
            error:"Please fill out the required form fields",
            form:req.body,
        });
    };
});

router.put("/employees/:id", requireAuth,async (req,res)=>{
    try{
        const payload={
            ...req.body,
            startDate:new Date(req.body.startDate),
            salary:Number(req.body.salary),
        };
        await Employee.findByIdAndUpdate(req.params.id,payload,{runValidators:true});
        res.redirect("/");
    }catch(err){
        const employees=await Employee.find().sort({createdAt:-1}).lean();
        res.status(400).render("employees/index",{
            employees:{...employees,...req.body},
            error:"Update failed: Check required fields.",
        });
    };
});

router.get("/employees/:id/edit", requireAuth,async (req,res)=>{
    const employee=await Employee.findById(req.params.id).lean();
    console.log(employee);
    if(!employee){
        return res.status(404).send("Employee not found");
    }
    res.render("employees/edit",{employee});
});

router.delete("/employees/:id", requireAuth,async (req,res)=>{
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect("/");
});

module.exports = router;