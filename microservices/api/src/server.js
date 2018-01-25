var express = require('express');
var path = require('path');
var fetchAction =  require('node-fetch');

var app = express();
var router = express.Router();

var server = require('http').Server(app);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/ui', function (req, res) {
	res.render('index');
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




var url = "https://data.burled79.hasura-app.io/v1/query";

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer ffacfb48d70413396799be8e88738f2e73cb6c935c37c369"
    }
};

var body = {
  "type": "select",
  "args": {
      "table": "fb_users",
      "columns": [
          "hasura_id",
          "fb_id",
          "name"
      ]
  }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
	return response.json();
})
.then(function(result) {
	console.log(result);
})
.catch(function(error) {
	console.log('Request Failed:' + error);
});













app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
