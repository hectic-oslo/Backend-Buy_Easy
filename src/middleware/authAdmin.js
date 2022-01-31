const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const admin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, 'easy-shop');
    
    const user = await User.findById({_id:decode._id}).select('-password');
    
    if (!user) {
      throw new Error();
    }
          
   
    req.user = user;
    if(req.user && req.user.isAdmin)
    {
        next();
    }
    
  } catch (e) {
    res.status(400).send({ error: "PLZ Authenticate as Admin" });
    
  }
};

module.exports = admin;
