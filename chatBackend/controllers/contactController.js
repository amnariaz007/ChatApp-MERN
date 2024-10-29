const userModel = require('../models/userModel');

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