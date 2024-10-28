const mongoose = require('mongoose');

const messageSchema = ({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false
    },
    messageType:{
        type: String,
        enum: ["text", "file"],
        required : true
    },
    content: {
        type: String,
        required: function (){
            return this.messageType === "text";
        },
    },
    fileUrl : {
        type: String ,
        required: function () {
            return this.messageType === "file"
        },
    },
    timestamp:{
        type: Date,
        default : Date.now
    }

})

module.exports = mongoose.model("message", messageSchema);