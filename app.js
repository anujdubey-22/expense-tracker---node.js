const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Expense = require('./models/expense');

const app = express();
app.use(cors());
app.use(bodyParser.json({extended:true}));

app.post('/user/signup',async(req,res,next) => {
    try{
        console.log(req.body);
        const {name,email,password} = req.body;
        console.log('user sign up post request');
        const data = await Expense.create({name:name,email:email,password:password});
        res.status(201).json('Done');
    }
    catch(error){
console.log(error,'error in creating Expense in app.js');
res.status(200).send('Duplicate Email Found')
    }

});

async function sync(){
try{
    const data = await Expense.sync();
    console.log(data)
    app.listen(3000,()=> {
        console.log('server started on Port 3000');
    });
}
catch(error){
    console.log(error,'error in sync database in app.js');
}
}

sync();