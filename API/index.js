var express = require("express");
var app = express();
var router = express.Router();
  
var path = __dirname + "/views/";

app.use(express.static('public'))
app.use("/",router);
  
router.get("/widget/header",function(req, res){
  console.log(req.url)
  res.send("this is a header");
});
router.get("/widget/footer",function(req, res){
  console.log(req.url)
  res.send( "<div class=\"footer\">this is a footer</di><style>.footer{color:red;}</style>");
});
router.get("/widget/banner",function(req, res){
  res.sendFile(path + "index.html");
});
router.get("/widget/leftsider",function(req, res){
  res.sendFile(path + "index.html");
});
router.get("/widget/rightsider",function(req, res){
  res.sendFile(path + "index.html");
});
  
app.use("*",function(req, res){
  res.send("Error 404: Not Found!");
});
  
app.listen(3001,function(){
  console.log("Server running at Port 3001");
});