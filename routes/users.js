const express = require("express");
const router = express.Router();
const {validateUser, User} = require("../models/users");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require("../routes/middlewares/auth")


router.get('/me',auth,async (req,res) =>{
  const user =  await User.findOne({_id:req.user.id}).select('-password')
  res.status(200).json(user)

});


router.post("/",async (req,res) =>{
   //validate users input
   const {error} = validateUser(req.body);
   if(error){
       res.status(400).send(error.details[0].message)
       return
   }

   console.log(validateUser(req.body))
   //validate system
 let user = await User.findOne({email: req.body.email});
 if(user){
     res.status(400).send("User already exists");
     return
 }
 
   //process
  user = new User(req.body);

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
   //response ok
   res.status(200).send(_.pick(user, ['name','email','biz','_id']));
});

module.exports = router;