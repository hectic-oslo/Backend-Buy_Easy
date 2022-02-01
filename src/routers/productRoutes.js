const express=require('express')
const products=require('../data/products')
const router= new express.Router()
const Product=require('../Models/ProductModel')
const auth= require("../middleware/authUser");
const admin= require("../middleware/authAdmin");


router.get('/Api/products',async(req,res)=>{
     const pageSize=6
     const page=Number(req.query.page)||1
    const keyword=req.query.keyword?{
        name:{
            $regex:req.query.keyword,
            $options:'i'
        }
    }:{}
    try {
        const productCount=await Product.countDocuments({...keyword})
        const getProducts= await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page-1))
        res.send({getProducts,page,pages:(Math.ceil(productCount/pageSize))})
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/Api/products/:id',async(req,res)=>{
    // const product=products.find((p)=>p._id===req.params.id)
    try {
        const product=await Product.findById(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(400).send(error)
    }
    
})

router.delete('/Api/products/:id',auth,admin,async(req,res)=>{
    try {
        const product=await Product.findById(req.params.id)
        if(product){
        //   await product.remove()
        await product.deleteOne()
          res.json({message:'product removed'})
        }
        
    } catch (error) {
         res.status(400).send(error)
         
    }
})



router.post('/Api/products',auth,admin,async(req,res)=>{
      const product=new Product({...req.body,user:req.user._id})
      try {
            const createdProduct= await product.save()
            res.send(createdProduct)
      } catch (error) {
          res.status(400).send(error)
      }
})

router.put('/Api/products/:id',auth,admin,async(req,res)=>{
    const {name,image,brand,category,description,countInStock,price}=req.body
  
    try {
        const product=await Product.findById(req.params.id)
          if(product){
              product.name=name,
              product.image=image,
              product.brand=brand,
              product.price=price,
              product.category=category,
              product.description=description,
              product.countInStock=countInStock
          }
          updatedProduct=product.save()
          res.send(updatedProduct)
    } catch (error) {
        res.status(400).send(error)
    }
})



// router.get('/Api/all/products',async(req,res)=>{
//     const products=await Product.find({})
//     res.send(products)
// })


router.post('/Api/products/:id/reviews',auth,async(req,res)=>{
    const {rating,comment}=req.body
    const product=await Product.findById(req.params.id)
    try {
     if(product){
        const alreadyReviewed= product.reviews.find(r=>r.user._id.toString()===req.user._id.toString())
        if(alreadyReviewed){
            res.status(401).send(error);
            throw new Error('Already updated')
        }
        const review={
            name:req.user.name,
            user:req.user,
            rating,
            comment
        }
       product.reviews.push(review)
       product.numReviews=product.reviews.length
       product.rating=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
       await product.save()
       res.status(200).json({'message':"review add"})
     }
          
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/Api/products/top/rated',async(req,res)=>{

    try {
        const products=await Product.find({}).sort({rating:-1}).limit(3)
        res.status(200).send(products)
        
    } catch (error) {
        res.status(400).send(error)
         
    }
})


module.exports=router