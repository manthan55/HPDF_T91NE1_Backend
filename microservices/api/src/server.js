var express = require('express');
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var isNumber = require('is-number');

//////////    Setup    //////////
var app = express();
var router = express.Router();
/////////////////////////////////

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
var url_query = "https://data.burled79.hasura-app.io/v1/query";
var url_getinfo = "https://auth.burled79.hasura-app.io/v1/user/info";
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

app.post('/APIEP_Signup_Username', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Signup_Username(username, password, res);
  }
});

app.post('/APIEP_Login_Username', function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Login_Username(username, password, res);
  }
});

app.post('/APIEP_Logout', function(req, res){
  var auth = req.body.auth;
  if (!auth.trim()) {
    res.send("A valid <b>auth_token</b> must be provided!");
  } else {
    Logout(auth, res);
  }
});

app.post('/APIEP_Likes', function(req, res){
  var like_user_id = req.body.like_user_id;
  var likeby_user_id = req.body.likeby_user_id;

  if(isNumber(like_user_id) && isNumber(likeby_user_id)){
    UpdateLikesTable(like_user_id, likeby_user_id, res);
  } else {
    res.send("One or more inputs is invalid (Should be numbers)");
  }
});
///////////////////////////////////////////////////////////////

////////////     API Endpoints GET Method    //////////////////
app.get('/APIEP_Signup_Username/:username/:password', function(req, res){
  var username = req.params.username;
  var password = req.params.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Signup_Username(username, password, res);
  }
});

app.get('/APIEP_Login_Username/:username/:password', function(req, res){
  var username = req.params.username;
  var password = req.params.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Login_Username(username, password, res);
  }
});

app.get('/APIEP_Logout/:auth_token', function(req, res){
  var auth = req.params.auth_token;
  if (!auth.trim()) {
    res.send("A valid <b>auth_token</b> must be provided!");
  } else {
    Logout(auth, res);
  }
});

app.get('/APIEP_Likes/:like_user_id/:likeby_user_id', function(req, res){
  var like_user_id = req.params.like_user_id;
  var likeby_user_id = req.params.likeby_user_id;
  if(isNumber(like_user_id) && isNumber(likeby_user_id)){
    UpdateLikesTable(like_user_id, likeby_user_id, res);
  } else {
    res.send("One or more inputs is invalid (Should be numbers)");
  }
});
///////////////////////////////////////////////////////////////


//////////////////////    Hasura API Calls    //////////////////////////

//////    Will implement below function in extended idea    //////
function Check_AuthToken(auth){
  var requestOptions = {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
    }
  };

  fetchAction(url_getinfo, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(JSON.stringify(result));
    return result;
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
    return error;
  });
}
//////////////////////////////////////////////////////////////////

function UpdateLikesTable(like_user_id, likeby_user_id, res){
  console.log(url_query);
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer b6236ecfc217c9ba326d363560d774d5737e78f24532673c"
    }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "Likes",
          "objects": [
              {
                  "like_user_id": like_user_id,
                  "likeby_user_id": likeby_user_id
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
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
  res.send("API Call successfull");
}

function Login_Username(username, password, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
  };

  var body = {
      "provider": "username",
      "data": {
          "username": username,
          "password": password
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_login, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(JSON.stringify(result));
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
}

function Signup_Username(username, password, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
  };

  var body = {
      "provider": "username",
      "data": {
          "username": username,
          "password": password
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_signup, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(JSON.stringify(result));
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
    res.send('Request Failed:' + error);
  });
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
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
