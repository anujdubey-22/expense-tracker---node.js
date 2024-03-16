const express = require('express');
const Expense = require('../models/expense');

function isValid(string){
    if(string==null || string==undefined || string.length==0){
        return false;
    }
    else{
        return true;
    }
};

exports.userPost = async (req, res, next) => {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;
      if(isValid(name) && isValid(email) && isValid(password)){
        console.log("user sign up post request");
        const data = await Expense.create({
          name: name,
          email: email,
          password: password,
        });
        res.status(201).json("Done");
      }
      else{
        res.status(200).send("Some field must be missing, Fill every Field.")
      }
      
    } catch (error) {
      console.log(error, "error in creating Expense in app.js");
      res.status(200).send("Duplicate Email Found");
    }
  };

exports.validatePost = async (req,res,next) => {
    try{
        const {email,password} = req.body;
        //console.log(email,password);
        const data = await Expense.findOne({where :{email :email}});
        if(data===null){
            res.json('email does not exist');
        }
        //console.log(data)
        //console.log(data.email);
       else if(data.password!=null && password !=data.password || data.password===null){
        res.json('password doent match')
       }
       else if(email===data.email && password===data.password){
        res.status(201).json('User Login Successfully');
       }

    }
    catch(error){
        console.log(error,'error in validate Post in controller');
    }
}

