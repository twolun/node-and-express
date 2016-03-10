var express = require('express');

var app = express();

// app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//设置静态资源目录
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.port || 3000)

app.get('/', function(req, res){
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
})


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