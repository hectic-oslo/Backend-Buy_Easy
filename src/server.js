const express=require('express')
const products=require('./data/products')
const connectDB=require('./db/mongoose')
const productRouter=require('./routers/productRoutes')
const userRouter=require('./routers/userRoutes')
const orderRouter=require('./routers/orderRoutes')
const uploadRouter=require('./routers/uploadRoutes')
const path=require('path')
const Razorpay=require('razorpay')

connectDB()
const app=express()
app.use(express.json())             //////for parsing data
app.use(productRouter)
app.use(userRouter)
app.use(orderRouter)
app.use(uploadRouter)
// __dirname=path.resolve()     //const
app.use('/frontend/public/images',express.static(path.join(__dirname,'/frontend/public/images')))


app.get('/Api/config/paypal',(req,res)=>{
  const PAYPAL_CLIENT_ID='AY6FXaUQyMsFuuB1bY--uLaoqEIwpxI3iNyP2OVsJKatf60BdX7ksinSUAV4THGvz8lgFNfZbw8BVHZi'
  res.send(PAYPAL_CLIENT_ID)
})

const razorpay=new Razorpay({
  key_id:'rzp_test_NENjtw57a4vV8I',
  key_secret:'pqgzueqlVLQRTe2fmZKI7jMv'
})


app.post('/Api/config/razorpay',async(req,res)=>{
   
  const options={
    amount:899900,
    currency:'INR',
  }
  try {
    const response=await razorpay.orders.create(options)
      res.send(response)
       
  } catch (error) {
    res.send(error)
  }
})



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}



const PORT=process.env.PORT ||3100
app.listen(PORT,()=>{
    console.log(`server is up on ${PORT}`);
})