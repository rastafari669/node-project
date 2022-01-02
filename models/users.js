const mongoose = require("mongoose");
const Joi = require('joi');
const jwt = require('jsonwebtoken')

 require('dotenv/config')


const usersSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required: true,
            minlength: 2,
            maxlength: 225
        },
        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 1024,
        },
        biz:{
            type: Boolean,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);

usersSchema.methods.generateAuthToken = function(){
  return jwt.sign({id: this._id,biz:this.biz},process.env.SECRET, {expiresIn: 500});
}

 const User = mongoose.model('User', usersSchema, "users");



 function validateUser(user){
     const schema = Joi.object({
         name: Joi.string().min(2).max(255).required(),
         email: Joi.string().min(6).max(255).email().required(),
         password: Joi.string().min(6).max(1024).required(),
         biz: Joi.boolean().required()
     });

    return schema.validate(user);
 }

 

module.exports = {
    User,
    validateUser
}