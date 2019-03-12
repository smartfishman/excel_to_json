/*
作者：李青山
日期：2019年3月11日
概述：main.html用到的js脚本
*/
$(document).ready(function () {
  //注册用户点击【上传excel文件】事件
  $("#upload").click(function(){
    console.log("upload click work")
    var data = new FormData();
    data.append('username', $("#user")[0].innerHTML);
    data.append('myfile',$("#myfile")[0].files[0])
    console.log(data.get("myfile"))

    $.ajax({ 
        type: 'post',
        contentType: false, // 关关关！
        processData: false, // 关关关！重点
        url: '/upload_excel',
        data: data,
        success: function (response) {
          // TODO
          console.log("upload done")
          console.log(response)
          alert("上传文件成功，请重新查询文件列表")
        },
        error: function(req,err,obj){
          console.log(req)
          console.log(err)
          console.log(obj)
        }
    });
  });
  
  //注册用户点击【用户名查询】事件
  $("#searchUser").click(function(){
    console.log(" searchUser click work")
    var username = $("#username")[0].value
    if(username != "admin" && username != "guest"){
      alert("目前用户名只支持admin和guest")
      return
    }
    var jsonObject = new Object()
    jsonObject.username = username
    $.ajax({ 
        type: 'post',
        contentType: "application/json", //在与express通信中，contentType极为重要，许多中间件都要根据
                                         //contentType决定是否解析该请求
        processData: false, 
        url: '/upload_excel/getFileList',
        data: JSON.stringify(jsonObject),
        success: function (response) {
          // TODO
          console.log("searchUser done")
          //将返回的文件列表展示
          console.log(response)
          var arr = response.split(",")  
          $("#fileList").empty()
          for(var i in arr){
            var label = '<label type="text" class="fileList_label ">'+arr[i]+'</label><br/>'
            $("#fileList").append(label)
          }
          //更改当前用户名
          console.log($("#user")[0])
          $("#user")[0].innerHTML = username
          //注册用户点击文件列表中的文件时的事件
          $(".fileList_label").click(function(){
            console.log("fileList_label click work")
            OnFileListLabelClick(this.innerHTML,username)
          })
        },
        error: function(req,err,obj){
        }
    });
  });
  
  //当fileList_label被点击时调用，调出配置表单
  function OnFileListLabelClick(filename,username){
    $("#configurationList")[0].style.display = "block"
    $("#user_configuration")[0].innerHTML = username
    $("#file_configuration")[0].innerHTML = filename
  };
  
  //注册用户点击【开始解析】事件
  $("#excel_parse").click(function(){
    var jsonObj = new Object()
    jsonObj.username = $("#user_configuration")[0].innerHTML
    jsonObj.filename = $("#file_configuration")[0].innerHTML
    jsonObj.columnList_configuration = $("#columnList_configuration")[0].value
    jsonObj.rowsList_configuration = $("#rowsList_configuration")[0].value
    console.log(JSON.stringify(jsonObj))
    $.ajax({ 
        type: 'post',
        contentType: "application/json", //在与express通信中，contentType极为重要，许多中间件都要根据
                                         //contentType决定是否解析该请求
        processData: false, 
        url: '/excel_parse',
        data: JSON.stringify(jsonObj),
        success: function (response) {
          // TODO
          console.log("excel_parse done")
          console.log(response)
          //调出下载JSON文件按钮
          $("#json_downloadPath")[0].href = response
          $("#json_download").removeClass("json_download_disable")
          $("#json_download").addClass("json_download_enable")
        },
        error: function(req,err,obj){
        }
    });
  });
  
  //注册用户点击【下载JSON】事件
  $("#json_download").click(function(){
    $("#json_downloadPath")[0].click()
  });
  
  
});