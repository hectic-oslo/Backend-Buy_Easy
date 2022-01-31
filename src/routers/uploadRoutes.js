const express=require('express')
const router= new express.Router()
const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    destination(req,file,cb){
        cb(null,'frontend/public/images/')   //<-------
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }

})
 function checkFileType(req,file,cb){
     const fileTypes =/jpg|jpeg|png/
     const extName=fileTypes.test(path.extname(`${file.originalname}`).toLowerCase())
     const mimType=fileTypes.test(file.mimtype)

     if(extName||mimType)
     {   return cb(null,true)
      }
      else{
           cb("Images allowed types .jpg .jpeg .png only!")
      }
 }
const upload=multer({
     storage,
     fileFilter:function(req,file,cb){
         checkFileType(req,file,cb)
     }
})

router.post('/Api/upload',upload.single('image'),(req,res)=>{
    res.send(`/${req.file.path}`)
})

module.exports=router