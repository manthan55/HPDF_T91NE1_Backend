var express = require('express');
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

var server = require('http').Server(app);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


/// URL Definitions ///
var url_signup = "https://auth.burled79.hasura-app.io/v1/signup";
///////////////////////

/// Middleware setup ///
var urlencodedParser = bodyParser.urlencoded({extended:false});
////////////////////////

app.get('/', function(req, res) {
  //res.send('Hello World');
  res.render('index');
});

app.get('/signup/:accessToken', function(req, res) {
  //res.send('Hello World');
  SignUp(req.params.accessToken);
});

app.post('/signup1', urlencodedParser, function(req, res) {
  //res.send('Hello World');
  console.log(req.body);
  //SignUp(req.params.accessToken);
});

app.get('/ui', function (req, res) {
	res.render('index2');
});

app.get('/FacebookSDK.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'FacebookSDK.js'));
});

// Uncomment to add a new route which returns hello world as a JSON
// app.get('/json', function(req, res) {
//   res.json({
//     message: 'Hello world'
//   });
// });
function SignUp(accessToken){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
      }
  };

  var body = {
      "provider": "facebook",
      "data": {
          "access_token": ""+accessToken
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_signup, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
