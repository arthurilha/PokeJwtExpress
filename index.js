var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const { response, request } = require('express');
var app = express()
var secret = '123456789'

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    if(req.path == '/login'){
        next()
    }else{
        var header = req.headers['authorization']
        if(!header){
            
            res.json({
                success: false,
                message :'error'
            })
        }else{
            var token = header.substring(7)
            console.log(token)
            if(!token){
                res.json({
                    success: false,
                    message :'error'
                })
            }else{
                try {
                    var decoded = jwt.verify(token, secret);
                    next()
                  } catch(err) {
                    res.json({
                        success: false,
                        message :'error'
                    })
                  }
            }
        }
    }
})


app.get('/',function(req,res){
    res.send("Site de Tecnologia");
});
app.get('/user',function(req,res){
    res.json({
        success: true,
        data: {
            "id": "1",
            "name": "arthur"
        }
    })
})
app.post('/login',function(req,res){
    console.log(req.body.username)
    var token = jwt.sign({
        "name": "arthur",
        "id" : "1",
        "email": "arthur@gmail.com"
    },secret,  { expiresIn: '1h' })

    var response = {
        success : true,
        data : token
    } 
   
    res.status(200).json(response)
});

jwt.sign({
    data: 'foobar'
  }, 'secret', { expiresIn: 60 * 60 });


app.listen(8080,function(){
    console.log("Servidor ativo no porto 8080");
});