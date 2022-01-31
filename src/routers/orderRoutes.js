const express = require("express");
const router = new express.Router();
const Order = require("../Models/OrderModel");
const generateToken = require("../utils/generateToken");
const auth = require("../middleware/authUser");
const admin = require("../middleware/authAdmin");

router.post('/Api/orders', auth,async(req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shipppingPrice,
    totalPrice,
  } = req.body;
  try{
    if(orderItems&&orderItems.length===0){
        res.status(400)
        throw new Error('No Order Item')
         return
    }
    
        const order=new Order({
           user:req.user._id,  
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shipppingPrice,
            totalPrice,
          })
       
          const createdOrder=await order.save()
          res.send(createdOrder)
    
  }
  catch(error){
   res.status(403).send(error)
}
});

router.get('/Api/orders/:id', auth,async(req, res) => {

  try{
    const order= await Order.findById(req.params.id).populate('user', 'name email')
    if(order)
    res.send(order)
  }
  catch(error){
    res.status(404).send(error)
    throw new Error('Order not found')
  }

})


router.put('/Api/orders/:id/pay', auth,async(req, res) => {

 try{
    const order= await Order.findById(req.params.id)
    if(order)
    {
      order.isPaid=true,
      order.paidAt=Date.now(),
      order.paymentResult={
        id:req.body.id,
        status:req.body.status,
        update_time:req.body.update_time,
        email_address:req.body.payer.email_address
        
      }

    }
    const updateOrder=await order.save()
    res.send(updateOrder)
  }
  catch(error){
    res.status(404).send(error)
    throw new Error('Order not found')
  }

})

router.put('/Api/razorpay/:id/details',async(req,res)=>{
  const order= await Order.findById(req.params.id)
 try {
  if(order){
    order.isPaid=true,
    order.paidAt=Date.now(),
    order.paymentResult={
      raz_orderId:req.body.raz_orderId ,
      raz_paymentId:req.body.raz_paymentId ,
      raz_signature:req.body.raz_signature 
    }
  }
  
  const updateOrder=await order.save()
  res.send(updateOrder)
 } catch (error) {
   res.status(400).send(error)
 }
})


router.get('/Api/myorders',auth,async(req,res)=>{
   
   try {
    const myOrders=await Order.find({user:req.user._id})
    res.send(myOrders)
      
   } catch (error) {
      res.status(400).send(error)

   }
})

router.get('/Api/orders',auth,admin,async(req,res)=>{
   
  try {
   const orders=await Order.find({}).populate('user','id name')
   res.send(orders)
     
  } catch (error) {
     res.status(400).send(error)

  }
})


router.put('/Api/orders/:id/deliver', auth,admin,async(req, res) => {

  try{
     const order= await Order.findById(req.params.id)
     if(order)
     {
       order.isDelivered=true,
       order.deliveredAt=Date.now()
 
     }
     const updateOrder=await order.save()
     res.send(updateOrder)
   }
   catch(error){
     res.status(404).send(error)
     throw new Error('Order not found')
   }
 
 })
 

module.exports=router