const express = require('express');
const res = require('express/lib/response');
const {Card, validateCard, generateBizNumber } = require('../models/cards');
const router = express.Router();

const auth = require("../routes/middlewares/auth")




//Create Card
router.post("/",auth, async (req,res) =>{
    const {error} = validateCard(req.body);
    
    if(error){
        res.status(400).send(error.details[0].message);
        return
    }
    

    let cardFound = await Card.findOne({
        bizPhone:req.body.bizPhone,

    })
    if(cardFound){
        res.status(400).send('Card already exists!');
        return;
    }

    const card = new Card({
        ...req.body,
        bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        bizNumber: await  generateBizNumber(),
        user_id: req.user.id
    });

    await card.save();

   res.status(200).json(card)
});


//delete Card
router.delete("/:id", auth,async (req,res) =>{
    const card = await Card.findByIdAndDelete({
        _id: req.params.id,
        user_id: req.user.id
  },
  );

  if(!card){
    res.status(404).send("The card with the given id was not found")
    return
}
res.status(200).send('Card successfully deleted');
})


//update Card
router.put('/:id',auth, async (req,res) =>{

    const {error} = validateCard(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return
    }


    const card = await Card.findByIdAndUpdate({
        _id: req.params.id,
        user_id: req.user.id
  },
  req.body)
  
  if(!card){
      res.status(404).send("The card with the given id was not found")
      return
  }
  
  res.status(200).json(card);
  })


  //get Card
router.get('/:id',auth, async (req,res) =>{
  const card = await Card.find({
    
      user_id: req.user.id
})
console.log(card);
if(!card){
    res.status(404).send("The card with the given id was not found")
    return
}

res.status(200).json(card);
})



module.exports = router