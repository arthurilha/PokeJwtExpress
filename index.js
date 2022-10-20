var express = require('express')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
const { response, request } = require('express');
var app = express()
var secret = '123456789'
const bcrypt = require('bcrypt');
const users = []
var id = 1

// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    if(req.path == '/login' || req.path == '/users'){
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



app.post('/users',function(req,res){
    console.log(req.body.username)
    const hash = bcrypt.hashSync(req.body.password, 10);
    var user= {id : id++, name : req.body.name, email : req.body.email, password : hash, city : req.body.city,
    phone : req.body.phone, birth : req.body.birth, school : req.body.school}

    if(!users.some(e => e.email == req.body.email))
        users.push(user)
    

    var response = {
        success : true,
    } 
   
    res.status(200).json(response)
});

app.post('/login',function(req,res){
    console.log(req.body.username)
    const user = users.filter(e => e.email == req.body.email).at(0)
    if(user){
        var teste = bcrypt.compareSync(req.body.password, user.password);
        if(teste){
            var token = jwt.sign({
                name : user.name,
                email : user.email,
                id : user.id
            },secret,  { expiresIn: '1h' })
        
            var response = {
                success : true,
                data : token
            } 
           
            res.status(200).json(response)
            return
        }
    }
    throw Error("Erro login não encontrado")
});

app.use(function(err, req, res, next) {
    console.error(err)
    var response = {
        success : false,
        message : err.message
    } 
   
    res.status(500).json(response)
});

app.checkDuplicateEmail = (req, res, next) => {
      // Email
      users.findOne({
        where: {
            email : req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Email já está em uso!"
          });
          return;
        }
        next();
      });
    }

app.listen(8080,function(){
    console.log("Servidor ativo no porto 8080");
});