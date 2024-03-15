const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json({extended:true}));

app.post('/user/signup',async(req,res,next) => {
    console.log(req.body)
    console.log('user sign up post request');
    res.json('Done');
});


app.listen(3000);