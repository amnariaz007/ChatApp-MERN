const { response } = require('express');
const messageModel = require('../models/messageModel');
const { default: mongoose } = require('mongoose');

module.exports.getMessages = async (req, res) => {
 try{
    
    const user1 = req.body.id;
    const user2 = req.body.id;

    console.log("User1:", user1); 
    console.log("User2:", user2); 

    if(!user1 || !user2){
        return res.status(400).send("user required ");
    }

     const messages = await messageModel.find({
           $or:[      
                  { sender: user1 },
                  { recipient: user1 }
                ]
            
     }).sort({timestamp: 1})
     console.log(messages, "messages")
     return res.status(200).json({messages})
 }catch(err){
    console.log(err.message);
    return response.status(500).send("internal server error")
 }
   
  };


