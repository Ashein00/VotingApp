const mongoose = require("mongoose");



const connectDatabase =()=>{
     
    mongoose.set("strictQuery", false);
    //mongoose.connect("mongodb://localhost:27017/votingAppDB", { useNewUrlParser: true });
    
    const DB_LINK =
      "mongodb+srv://sanjueranga:A8D0iBJyKqXgTtYy@cluster0.rl958vp.mongodb.net/?retryWrites=true&w=majority";
    
    
    
    mongoose.connect(
      DB_LINK,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        (err) => {
          if (err) {
            console.log("MongoDB Connection Failed");
          } else {
            console.log("Mongodb is connected");
          }
        }
      );

}


module.exports = connectDatabase;