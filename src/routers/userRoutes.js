const express=require('express')
const router= new express.Router()
const User=require('../Models/UserModel')
const generateToken=require('../utils/generateToken')
const auth= require("../middleware/authUser");
const admin= require("../middleware/authAdmin");

router.post('/Api/users',async (req,res)=>{
    const user=new User(req.body)
    try{
        await user.save()
         
        //  res.send(user)
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
          token:generateToken(user._id)
        })
    }
    catch(error){
        res.status(404).send(error)
    }
})
router.post('/Api/users/login',async (req,res)=>{
     const {email,password}=req.body
    try{
        const user= await User.findOne({email})
      if(user && (await user.matchPassword(password)))
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
          token:generateToken(user._id),
          isAdmin:user.isAdmin
        })
         
    }
    catch(error){
        res.status(404).send(error)
        throw new Error('Invalid Email or Password')
    }
})

router.get('/Api/users/profile',auth,async(req,res)=>{
    
    try{
        const user=await User.findById({_id:req.user._id})
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
         
        })
    }
    catch(error){
        res.status(404).send(error)
        throw new Error('cant update wrong details')
    }
    
})

router.put('/Api/users/profile',auth,async (req,res)=>{
    const user=await User.findById({_id:req.user._id})
    try{
         if(user){
             user.name=req.body.name ||user.name
             user.email=req.body.email|| user.email
             if(req.body.password){
                 user.password=req.body.password
             }
         }


         const updatedUser =await user.save()
         
        //  res.send(user)
        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            password:updatedUser.password,
          token:generateToken(updatedUser._id)
        })
    }
    catch(error){
        res.status(404).send(error)
        throw new Error('cant update wrong details')
    }
})
router.get('/Api/users',auth,admin,async(req,res)=>{
     
    try{
        const getUsers=await User.find({})//
        if(getUsers){
            res.send(getUsers)
        }
        else{
            throw new Error('login as admin')
        }
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.delete('/Api/users/:id',auth,admin,async(req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(user){
        //   await user.remove()
        await user.deleteOne()
          res.json({message:'user removed'})
        }
        
    } catch (error) {
         res.status(400).send(error)
         
    }
})
 router.get('/Api/users/:id',auth,admin,async (req,res)=>{
  try {
      const user= await User.findById(req.params.id).select('-password')
      if(user){
          res.json(user)
      }
      else{
        throw new Error('Cant find any user with given info')
      }
  } catch (error) {
       res.status(400).send(error)
       
  }
 })


router.put('/Api/users/:id',auth,admin,async (req,res)=>{
    const user=await User.findById(req.params.id)
    try{
         if(user){
             user.name=req.body.name ||user.name
             user.email=req.body.email|| user.email
             user.isAdmin=req.body.isAdmin
             
         }
         const updatedUser =await user.save()
       
        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            password:updatedUser.password,
           isAdmin:updatedUser.isAdmin
        })
    }
    catch(error){
        res.status(404).send(error)
        throw new Error('cant update wrong details')
    }
})



module.exports=router