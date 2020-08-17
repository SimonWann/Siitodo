var express = require('express');
var app = express();

app.use('/',function(req,res){
    
    res.redirect(302,'http://suzzs.top/public/index.html');
})

app.listen(8000,function(){
    console.log('redirect server start~');
})