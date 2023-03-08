const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://adityakrjha112:18K1B6TxOo9ORI6v@inotebook.ch6nv4a.mongodb.net/inotebook?retryWrites=true&w=majority"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;