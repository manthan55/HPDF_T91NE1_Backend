var express = require('express');
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var isNumber = require('is-number');

var app = express();
var router = express.Router();

/// Middleware setup ///
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//var urlencodedParser = bodyParser.urlencoded({extended:true});
////////////////////////


var server = require('http').Server(app);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


/// URL Definitions ///
var url_signup = "https://auth.burled79.hasura-app.io/v1/signup";
var url_login = "https://auth.burled79.hasura-app.io/v1/login";
var url_logout = "https://auth.burled79.hasura-app.io/v1/user/logout";
var url_query = "https://data.bleed71.hasura-app.io/v1/query";
///////////////////////



app.get('/', function(req, res) {
  //res.send('Hello World');
  res.render('index');
});

app.get('/APIEP_Test', function(req, res) {
  //res.send('Hello World');
  res.render('APIEP_Test');
});

app.get('/auth/:accessToken', function(req, res) {
  //res.send('Hello World');
  //console.log(req.params.accessToken);
  SignUp(req.params.accessToken, res);
});

app.get('/logout', function(req, res) {
  //res.send('Hello World');
  //console.log(req.params.accessToken);
  var auth = req.cookies.auth;
  console.log(auth);
  res.clearCookie('auth');
  Logout(auth, res);
});

app.get('/Loggedin', function (req, res) {
	res.render('Loggedin');
});

app.get('/ui', function (req, res) {
	res.render('index2');
});

//////////////     Send resource files     ////////////////////
app.get('/FacebookSDK.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'FacebookSDK.js'));
});
app.get('/JCode.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'JCode.js'));
});
///////////////////////////////////////////////////////////////



//////////////////     API Endpoints     //////////////////////
app.post('/APIEP', function(req, res){
  var like_user_id = req.body.name;
  var likeby_user_id = req.body.email;
  if(isNumber(like_user_id) && isNumber(likeby_user_id)){
    UpdateLikesTable(like_user_id, likeby_user_id, res);
  } else {
    res.send("One or more inputs is invalid (Should be numbers)");
  }
});
///////////////////////////////////////////////////////////////

function UpdateLikesTable(like_user_id, likeby_user_id, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "Likes_SuperLikes",
          "objects": [
              {
                  "User_id": like_user_id,
                  "Likes_User_id": likeby_user_id
              }
          ]
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_query, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(JSON.stringify(result));
    res.send("Done");
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
  res.send("done!");
}



// Uncomment to add a new route which returns hello world as a JSON
// app.get('/json', function(req, res) {
//   res.json({
//     message: 'Hello world'
//   });
// });
function SignUp(accessToken, res){
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
  	//console.log(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
  login(accessToken, res);
}

function login(accessToken, res){
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

  fetchAction(url_login, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(result);
    res.cookie('auth',result.auth_token);
    //res.render('Loggedin');
    res.redirect('/Loggedin');
    //res.send("logged In");
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
  console.log("loggedin!");

}

function Logout(auth, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
    }
  };

  fetchAction(url_logout, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(result);
    res.send("logged out");
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
