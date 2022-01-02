const express = require('express');
const router = express.Router();
const Joi = require("joi");
const { User,generateAuthToken } = require('../models/users');
const bcrypt = require("bcrypt");
const _ = require('lodash');


router.post('/',async (req,res) =>{
    //validate user's inputs
    
    const {error} = validateUser(req.body);
   if(error){
       res.send(error.details[0].message)
       return
   }

   //validate system
   let user = await User.findOne({email:req.body.email});
   if(!user){
       res.status(400).send('Invalid Email or Password');
       return;
   }

   const isValidPassword = await bcrypt.compare(req.body.password, user.password);

   if(!isValidPassword){
       res.status(400).send('Invalid email or Password')
       return
   }

  const {id,biz} = user;
  

   //process
   const token = await user.generateAuthToken()

   //response ok
   res.status(200).json({
       token,
       id,
       biz
    })
  

});


function validateUser(user){
    const schema = Joi.object({
        
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required(),
        
    });

   return schema.validate(user);
}

module.exports = router;