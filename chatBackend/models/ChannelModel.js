const mongoose = require('mongoose');

const channelSchema = mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    members: [{type: mongoose.Schema.ObjectId, 
        ref: "user",
        required: true
    }],
    admin : {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    messages: {
        type: mongoose.Schema.ObjectId,
        ref: "message",
        required: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

channelSchema.pre("save", function (next){
    this.updatedAt = Date.now();
    next();
})

channelSchema.pre("findOneAndUpdate", function (next){
    this.set({updatedAt: Date.now()});
    next()
})


module.exports = mongoose.model("channel", channelSchema);