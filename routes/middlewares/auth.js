const jwt = require('jsonwebtoken');
require('dotenv/config')


const auth = (req,res,next) =>{
  const token = req.headers['authorization'];
  
  
   if(!token){
     res.status(404).send('Access denied. No token provided')
     return
   }
   try {
   const payload =  jwt.verify(token,
  process.env.SECRET)
  req.user = payload;
  next();

   } catch (error) {
     res.status(400).send('Invalid Token')
   }
   
}


module.exports = auth;