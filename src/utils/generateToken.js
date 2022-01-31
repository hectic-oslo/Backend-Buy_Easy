const jwt=require('jsonwebtoken')


const generateToken=(_id)=>{
 token= jwt.sign({_id},'easy-shop',{
        expiresIn:'30d'
    })
    return token
}

module.exports=generateToken