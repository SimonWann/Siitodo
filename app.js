var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var formidable = require('formidable');

var app = express();
app.engine('art',require('express-art-template'));
app.use('/public',express.static(path.join(__dirname,'/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose.connect('mongodb://simonwann:123123@localhost:27017/todo');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongodb connected');
});
var listSchema = mongoose.Schema({
    content:String,
    name:String
});
var userSchema = mongoose.Schema({
    username:String,
    password:String,
    email:String,
    content:Array
});
var list = mongoose.model('list',listSchema);
var User = mongoose.model('User',userSchema);

app.use('/',function(req,res){
    
    res.redirect(302,'http://167.179.83.167:3000/public/index.html')
})
app.post('/submit',function(req,res){
    // const form = formidable.IncomingForm();
    
    // var task = new list({
    //     content:req.body.list
    // });
    var content = req.body.list;
    console.log("\""+req.body.username+"\"");
    User.find({
        username:req.body.username
    },function(err,user){
        console.log(user[0]);
        user[0].content.push(content);
        user[0].save();
        res.send(user[0].content);
    })

    // form.parse(req,function(err,fields,files){
    //     console.log(fields)
    //     User.find({
    //         username:fields.username
    //     },function(err,user){
    //         console.log(fields)
    //         // user[0].content.push(fields.content);
    //         user.save();
    //         // res.send(user[0].content);
    //     })
    // })
    
    
})
app.post('/loginUp',function(req,res){
    const form = formidable.IncomingForm();
    var isSend = 0;
    form.parse(req,function(err,fields,files){
        console.log(fields);
        // console.log(files);
        var hasUser = User.find({
            username:fields.username
        },function(err,user){
            if(user.length>0){
                console.log("user" +user);
                res.send('fail');
                isSend = 1;
                return;
            }
            console.log(fields.username);
            // console.log(user[0].username);
            // if(fields.username === user[0].username){
            //    console.log(err);
            //     res.send('fail');
            //     isSend = 1;
            // }
            console.log('------------------------');   
            var user1 = new User({
                username:fields.username,
                password:fields.passwd,
                email:fields.email  
            });
            // console.log('isSend='+isSend);
            if(isSend !== 1){
                user1.save(function(err,user1){
                    // console.log('isSend='+isSend);
                    console.log('用户信息已保存');
                    res.send('ok');
                })
            }
        });
    });
        
})
app.post('/loginIn',function(req,res){
    const form = new formidable.IncomingForm();
    form.parse(req,function(err,fields,files){
        console.log(fields);
        var loginUser = User.find({username:fields.loginName},function(err,user){
            console.log(user);
            console.log('_________________________');
            // res.send('ok');
            if(user.length===1){
                console.log('_________________________');
                if( user[0].username === fields.loginName && user[0].password === fields.loginPasswd){
                    console.log('_________________________');
                    res.send({
                        username:user[0].username,
                        content:user[0].content
                    });
                    return;
                }else{
                    res.send('fail');
                    return;
                }
            } else {
                res.send('fail');
                return;
            }
            
        }); 
    });  
});
app.post('/clearDone',function(req,res){
    console.log(req.body);
    if(req.body['index[]']===undefined){
        
        res.statusCode = 400;
        console.log('fail');
        res.send('fail');
        return;
    }
    var username = req.body.username;
    var index = [];
    for(var i = 0;i<req.body['index[]'].length;i++){
        index.push(req.body['index[]'][i]);
    }
    console.log('index = '+index);
    var isDone = 0;
    User.find({
        username:username
    },function(err,data){
        console.log(data);
        for(var i=index.length - 1;i>=0;i--){
            console.log(data[0].content[parseInt(index[i])]);
            data[0].content.splice(1,parseInt(index[i]));
        }
        
        data[0].save();
        res.send('ok');
    })
});

app.listen(3000,function(){
    console.log('running~');
});