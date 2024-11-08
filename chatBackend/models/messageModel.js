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
    voiceNoteUrl: { 
        type: String, 
        required: function() { return this.messageType === 'voice'; } // Required if messageType is "voice"
    },
    content: { type: String, required: function() { return this.messageType !== 'file'; } },
    fileUrl: { type: String, required: function() { return this.messageType === 'file'; } },
    timestamp:{
        type: Date,
        default : Date.now
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }]

})

module.exports = mongoose.model("message", messageSchema);