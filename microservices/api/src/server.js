var express = require('express');
var path = require('path');

var app = express();
var router = express.Router();

var server = require('http').Server(app);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/r', function (req, res) {
	res.render('deny');
});

// Uncomment to add a new route which returns hello world as a JSON
// app.get('/json', function(req, res) {
//   res.json({
//     message: 'Hello world'
//   });
// });

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
