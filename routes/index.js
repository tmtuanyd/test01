var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'School',
  password: '20134338t',
  port: 5432,
})

/* GET home page. */
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/loginacc', function(req, res, next) {
  res.render('login');
});
router.post('/loginacc',urlencodedParser, function(req, res, next) {
  console.log(req.body.login_type)
  console.log(req.body.username)
  console.log(req.body.password)
  var login_type = req.body.login_type
  var username = req.body.username
  var password =req.body.password
  pool.query('select authority.a_mean,username,pw from listuser, authority where listuser.a_name=authority.a_name',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      loginAccount=response.rows.filter((el)=>el.a_mean===login_type&&el.username===username&&el.pw===password)
      if(loginAccount.length===0)(
        console.log('Ban da nhap sai mk')
      )
      else {
        req.session.account=loginAccount
        res.send('lay du lieu thanh cong ' +req.session.account);
      }
    }
  })
 
});
//truyen thong tin account ve react
router.get('/getaccount', function(req, res, next) {
  console.log(req.session.account)
  if(req.session.account){
    return res.send(req.session.account);
  }

});
router.get('/logout', function(req, res, next) {
  console.log(req.session.account)
  if(req.session.account){
    req.session.account=null
    return res.send(req.session.account);
  }
});
router.get('/getdata', function(req, res, next) {
  console.log('day la api lay du lieu teacher cho react js')
  pool.query('select a.username, a.fullname,a.i_mean,a.a_mean, classlist.c_mean,a.first_name from (select listuser.username, listuser.fullname,institute.i_mean,authority.a_mean,scheduler.c_name,listuser.first_name from listuser left join scheduler on listuser.username = scheduler.username join institute on listuser.i_name=institute.i_name join authority on listuser.a_name=authority.a_name) a left join classlist on a.c_name=classlist.c_name order by 6',(error,response)=>{
    if(error){
      console.log(error)
    }
    else{
      res.send(response.rows)
    } 
    //pool.end();
  })
})
module.exports = router;
