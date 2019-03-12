/*
作者：李青山
日期：2019年3月12日
概述：处理文件解析和下载的路由。
这里会将EXCEL文件按用户配置表进行解析，并将解析后的json文件提供下载。
*/
var express = require("express");
var fs = require("fs")
var path = require("path")
var Excel = require("exceljs");
var router = express.Router();
var workbook = new Excel.Workbook();

//匹配URL 获取用户配置表单开始解析文件
router.post("/",function(req,res,next){
  console.log(req.body)
  var filepath = path.resolve("./public/users_data/excel/",req.body.username,req.body.filename)
  var filename_noext = path.basename(req.body.filename,".xlsx")
  var outputPath = path.resolve("./public/users_data/json/",req.body.username,filename_noext+".txt")
  var path_download = path.join("../users_data/json/",req.body.username,filename_noext+".txt")
  console.log(path_download)
  parseExcel(filepath,req.body.columnList_configuration,req.body.rowsList_configuration,outputPath)
  res.send(path_download)
})

//匹配URL 提供json文件下载
router.post("/downloadJson",function(req,res,next){
  console.log(req.body.jsonPath)
  res.download(req.body.jsonPath);
})

//根据配置表单解析excel
function parseExcel(filepath,columnList,rowsList,outputPath){
  var arr_column = columnList.split(',')
  workbook.xlsx.readFile(filepath)
    .then(function() {
      // 从excel中获取数据
      var worksheet = workbook.getWorksheet(1);
      // console.log(workbook)
      var column_index = new Object()
      for(var i in arr_column){
        console.log(arr_column[i].split('=')[0])
        column_index[arr_column[i].split('=')[1]] = parseInt(arr_column[i].split('=')[0])
      }
      var start_index = parseInt(rowsList.split('-')[0]);
      var end_index = parseInt(rowsList.split('-')[1]);
      var result_array = new Array();
      var index = 0;  
      for(var key in column_index){
        worksheet.getColumn(column_index[key]).eachCell(function(cell, rowNumber) {
          //获取start_index到end_index之间的所有残疾证号
          if(rowNumber>=start_index && rowNumber<=end_index){
            var obj = result_array[index]?result_array[index]:new Object()
            obj[key] = cell._value.model.value
            result_array[index++] = obj
          }
        });
        index = 0
      }
      console.log(result_array)
      var result_str =JSON.stringify(result_array);
      //将json写入filename_ext.txt
      fs.writeFile(outputPath,result_str,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
         if(err){
           
           console.log("文件写入失败")
           console.log(err)
         }else{
           console.log("文件写入成功");
         }
      }) 
    });
}
module.exports = router;