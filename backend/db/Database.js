const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL).then((data)=>{
        console.log(`mongodb connected with server:${data.connection.host}`)
    }) .catch((err)=>{
        console.log(`DB connection error:${err}`);
     });
    
    // mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    //     if (err)
    //         console.error(err);
    //     else
    //         console.log("Connected to the mongodb"); 
    // }).then((data)=>{
    //         console.log(`mongodb connected with server:${data.connection.host}`)
    //     });
}

module.exports = connectDatabase;