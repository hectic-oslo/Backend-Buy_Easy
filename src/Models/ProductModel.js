const mongoose=require('mongoose')



const ReviewSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'

   },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const ProductSchema=mongoose.Schema({
    user:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'User'

    },
    name:{
        type:String,
        // required:true
    },
   image:{
        type:String,
        // required:true,
       
    },
    brand:{
        type:String,
        // required:true
    },
    category:{
        type:String,
        // required:true,
       
    },
    description:{
        type:String,
        // required:true,
        
    },
    reviews:[ReviewSchema],
    rating:{
        type:Number,
        required:true,
        default:1
    },
    numReviews:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
   countInStock:{
        type:Number,
        required:true,
        default:0
    },
},{
},{
    timestamps:true
})

const ProductModel=mongoose.model('Product',ProductSchema)

module.exports=ProductModel