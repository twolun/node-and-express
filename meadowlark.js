var bodyParser = require('body-parser');
var formidable = require('formidable');
var cookieParser = require('cookie-parser');
var express = require('express');

var credentials = require('./credentials.js');


var app = express();

//body-parser中间件，处理POST表单请求
app.use(bodyParser());
//使用cookie
app.use(cookieParser(credentials.cookieSecret));

// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//设置静态资源目录
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.port || 3000)

app.get('/', function(req, res){
    //设置cookie测试
    res.cookie('monster', 'nom nom');
    res.cookie('singed_monster', 'nom nom', {signed: true});
    
    res.set('Content-Type', 'text/plain');
    var s = '';
    for(var name in req.headers){
        s += name + ': ' + req.headers[name] + '\n';
    }
    // res.render('home');
    res.send(s);
});

app.get('/about', function(req, res){
    res.render('about');
});


app.get('/newsletter', function(req, res){
    res.render('newsletter', {csrf: 'CSRF token goes here '});
});
//注册成功，重定向的页面
app.get('/thank-you', function(req, res){
   console.log('thank-you', req.query);
   res.render('thank-you', {name: req.query.name, email: req.query.email}); 
});

//文件 上传测试
app.get('/contest/vacation-photo', function(req, res){
   var now = new Date();
   res.render('contest/vacation-photo', {
       year: now.getFullYear(), month: now.getMonth()
   }); 
});

//处理表单提交的post请求
app.post('/process', function(req, res){
    console.log(req.xhr, req.accepts('json, html'));
    if(req.xhr || req.accepts('json, html') === 'json'){
        res.send({success: true});
    }else{
        res.redirect(303, '/thank-you?name=' + req.body.name + '&email=' + req.body.email);
        
    }
});

//处理文件上传测试表单
app.post('/contest/vacation-photo/:year/:month', function(req, res){
   var form = new formidable.IncomingForm();
   form.parse(req, function(err, fields, files){
      if(err){
          return res.redirect(303, '/error');
      } 
      console.log('received fields: ');
      console.log(fields);
      console.log('received files: ');
      console.log(files);
      res.redirect(303, '/thank-you?name=' + req.body.name + '&email=' + req.body.email);
   }); 
});



app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
   console.error(err.stack);
   res.status(500);
   res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
})