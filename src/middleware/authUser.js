const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, 'easy-shop');
    
    const user = await User.findById({_id:decode._id}).select('-password');
    
    if (!user) {
      throw new Error();
    }
          
    //req.token = token;
    req.user = user;
    
    next();
  } catch (e) {
    res.status(400).send({ error: "PLZ Authenticate" });
  }
};

module.exports = auth;
