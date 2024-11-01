const userModel = require('../models/userModel');
const messageModel = require ('../models/messageModel');
const mongoose = require('mongoose')


module.exports.searchContacts = async (req, res) => {
 try{
    const {searchTerm} = req.body;
     if(searchTerm === undefined || searchTerm === null){
        return res.status(400).send("searchTerm is required");
     }

     const sanitizedSearchTerm = searchTerm.replace(
        /[.*?^${}|()[\][\\]]/g,
        "\\$&"
     );

     const regex = new RegExp(sanitizedSearchTerm, "i");

     const contacts = await userModel.find({
            $and: [
                {_id: { $ne : req.userId}},
                {
                    $or: [{ firstname: regex}, {lastname: regex}, {email: regex}],
                }
            ]
     })
     return res.status(200).json({contacts})
 }catch(err){
    console.log(err.message);
    //return response.status(500).send("internal server error")
 }
   
  };

  module.exports.getAllContactMessages = async (req, res) => {
   try {
      const userId = new mongoose.Types.ObjectId(req.user._id); // Assuming `req.user._id` contains the authenticated user's ID
      
      const contacts = await messageModel.aggregate([
         {
           $match: {
             $or: [{ sender: userId }, { recipient: userId }],
           },
         },
         {
           $sort: { timestamp: -1 },
         },
         {
           $group: {
             _id: {
               $cond: {
                 if: { $eq: ["$sender", userId] },
                 then: "$recipient",
                 else: "$sender",
               },
             },
             lastMessageTime: { $first: "$timestamp" },
           },
         },
         {
           $lookup: {
             from: "users",
             localField: "_id",
             foreignField: "_id",
             as: "contactInfo",
           },
         },
         {
           $unwind: "$contactInfo",
         },
         {
           $project: {
             _id: 1,
             lastMessageTime: 1,
             email: "$contactInfo.email",
             firstname: "$contactInfo.firstname",
             lastname: "$contactInfo.lastname",
             image: "$contactInfo.image",
             color: "$contactInfo.color",
           },
         },
         {
           $sort: {
             lastMessageTime: -1,
           },
         },
      ]);

      return res.status(200).json({ contacts });
   } catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal server error");
   }
};


module.exports.getAllContacts = async (req, res) => {
  try{
    
    const user = await userModel.find({
      _id: {$ne: req.userId}
    }, "firstname lastname _id email"
  );

  const contacts = user.map((user)=>({
    label: user.firstname ? `${user.firstname} ${user.lastname}` : user.email,
    value : user._id
  }))
      
      return res.status(200).json({contacts});
  }catch(err){
     console.log(err.message);
     //return response.status(500).send("internal server error")
  }
    
   };

 