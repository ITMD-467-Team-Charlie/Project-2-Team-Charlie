var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/',(req,res)=>{
  var dbo=dbobj.get();
  dbo.collection("users").insertOne(req.body,(err,data)=>{
      if(err){
          res.send(err);
      }else{
          dbo.collection('users').find({}).toArray((err,data)=>{
              if(err) throw err;
              res.send(data);
          });
      }
  })
});

router.get('/',(req,res)=>{
  var dbo=dbobj.get();
  dbo.collection('users').find({}).toArray((err,data)=>{
      if (err){
          res.send(err);

      }else{
          res.send(data);
      }
  })
});

router.put('/:firstName',(req,res)=>{
  var dbo=dbobj.get();
   
  dbo.collection('user').updateOne({firstName:req.params.firstName},{$set:{phoneNumber:req.body.phoneNumber}},(err,data)=>{
      if (err){
          res.send(err);
      }
      else{
          dbo.collection('user').find({}).toArray((err,data)=>{
              if (err) throw err;
              res.send(data);
          })
      }
  })
});

router.delete('/:name',(req,res)=>{
  console.log(req.params.name)
  console.log('user')
   var dbo=dbobj.get();
   dbo.collection('user').deleteOne({firstName:req.params.name},(err,data)=>{
       if (err){
           res.send(err);
       }
       else{
           dbo.collection('user').find({}).toArray((err,data)=>{
               if (err) throw err;
               res.send(data);
           })
       }
   })
});

module.exports = router;
