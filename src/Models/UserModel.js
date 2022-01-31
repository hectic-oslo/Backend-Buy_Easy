const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
},{
    timestamps:true
})
UserSchema.methods.matchPassword = async function (password) {
   
    return (await bcrypt.compare(password, this.password));
    
  };


UserSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });

  
  
const UserModel=mongoose.model('User',UserSchema)

module.exports=UserModel