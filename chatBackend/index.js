const express = require('express');
const app = express();
require('dotenv').config(); 
const cors = require('cors');
const cookieparser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
const authRoutes = require('./routes/AuthRoutes')
const contactRoutes = require('./routes/contactRoutes');
const messageRoutes = require('./routes/messageRoutes')
const setupSocket = require('./socket');
const channelRoutes = require('./routes/channelRoutes');
const blockRoutes = require('./routes/blockRoutes');


//middlewares
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));

app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))
app.use(express.json());
app.use(cookieparser());
const port = process.env.PORT || 3001
const db = process.env.MOONGODB_URI;

//ApiRoutes

app.use('/api/auth', authRoutes);
app.use('/api/contact/', contactRoutes)
app.use('/api/message/', messageRoutes)
app.use('/api/channel/', channelRoutes)
app.use('/api/block/', blockRoutes)



const server = app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`)
})

setupSocket(server);

mongoose.connect(db)
.then(()=> console.log("Db connected")).catch(err=> console.log(err));