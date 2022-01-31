const mongoose=require("mongoose")
require('dotenv').config();

const connectDB=async()=>{

   try{
          const connect=await mongoose.connect('mongodb://127.0.0.1:27017/Easy-Shop-App',{
              useNewUrlParser:true,
              useUnifiedTopology:true
          })
          console.log(`Mongodb Connencted:${connect.connection.host}`);
          console.log(process.env.MONGODB_URI);
   }
   catch(error)
   {
         console.log(`Error:${error}`);
         process.exit(1)
   }

}
module.exports=connectDB