/*
作者：李青山
日期：2019年3月11日
概述：处理文件上传的路由。
这里会将EXCEL文件按用户名建立文件夹，原文件名作为文件名存储文件。
*/
var express = require("express");
var multer = require("multer");
var fs = require("fs")
var path = require("path")
var router = express.Router();
//修改默认的文件存储路径及文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file.originalname)
    console.log(req.body.username)
    cb(null, './public/users_data/excel/'+req.body.username)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })
//注册中间件
router.use(upload.single('myfile')) 

//匹配URL 文件上传结果返回
router.post("/",function(req,res,next){
  // console.log(req.file)
  // console.log(req.file.filename)
  if(req.file){
    res.send("上传成功")
  }else{
    res.send("上传失败")
  }
});

//匹配URL 返回当前用户的文件列表
router.post("/getFileList",function(req,res,next){
  var dirPath = path.resolve("./public/users_data/excel/",req.body.username)
  var filelist= fs.readdirSync(dirPath,{withFileTypes:false})
  res.send(filelist.toString())
})

module.exports = router;