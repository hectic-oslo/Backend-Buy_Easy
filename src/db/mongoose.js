const mongoose=require("mongoose")
require('dotenv').config();

const connectDB=async()=>{

   try{
          const connect=await mongoose.connect('mongodb+srv://Buy-Easy:BuyEasy111@cluster0.okz9u.mongodb.net/Easy-Shop-App',{
              useNewUrlParser:true,
              useUnifiedTopology:true
          })
          console.log(`Mongodb Connencted`);
        //   console.log(process.env.MONGODB_URI);
   }
   catch(error)
   {
         console.log(`Error:${error}`);
         process.exit(1)
   }

}
module.exports=connectDB