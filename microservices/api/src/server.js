var express = require('express');
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var isNumber = require('is-number');
var multer  = require('multer');
var fs = require("fs");
var imagePath;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    imagePath = Date.now() + path.extname(file.originalname);
    cb(null, imagePath) //Appending .jpg
  }
})
var upload = multer({ storage: storage });

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
var url_signup = "https://auth.boat40.hasura-app.io/v1/signup";
var url_login = "https://auth.boat40.hasura-app.io/v1/login";
var url_logout = "https://auth.boat40.hasura-app.io/v1/user/logout";
var url_query = "https://data.boat40.hasura-app.io/v1/query";
var url_getinfo = "https://auth.boat40.hasura-app.io/v1/user/info";
var url_file_upload = "https://filestore.boat40.hasura-app.io/v1/file";
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

app.post('/APIEP_Match', function(req, res){
  var like_user_id = req.body.like_user_id;
  var likeby_user_id = req.body.likeby_user_id;

  if(isNumber(like_user_id) && isNumber(likeby_user_id)){
    Match_is_present(like_user_id, likeby_user_id, res);
  } else {
    res.send("One or more inputs is invalid (Should be numbers)");
  }
});

app.post('/APIEP_PP', upload.any(), function(req, res, next){
  //res.send(req.files[0].filename);
  //test("ddata");
  //var image = req.body.image;
  //console.log(image);
  /*
  var test = true;
  while(test){
    if(req.files[0].filename){
      test = false;
      var image = 'uploads/'+req.files[0].filename+'';
    }
  }
  */
  //res.send(image);
  //UploadPP(image, res);
  //var imge=fs.readFileSync(req.file.destination+’/’+imgpath);
  var image=fs.readFileSync(req.files[0].destination+'/'+imagePath);
  var imageType = req.files[0].mimetype;
  console.log("req.body.name : " + req.body.name);
  UploadPP(image, imageType, res);
});

app.post('/APIEP_Logger', function(req, res){
  console.log("console logged incoming request");
  console.log(req.file);
  res.send("received");
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

app.get('/APIEP_Match/:like_user_id/:likeby_user_id', function(req, res){
  var like_user_id = req.params.like_user_id;
  var likeby_user_id = req.params.likeby_user_id;
  if(isNumber(like_user_id) && isNumber(likeby_user_id)){
    Match_is_present(like_user_id, likeby_user_id, res);
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
        "Authorization": "Bearer 6820ea7f878a847624818f78081df55e9791ae18bcc67b4b"
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


function Match_is_present(like_user_id, likeby_user_id, res){
  console.log("function match present called");
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6820ea7f878a847624818f78081df55e9791ae18bcc67b4b"
      }
  };

  var body = {
      "type": "select",
      "args": {
          "table": "Likes",
          "columns": [
              "prim_key"
          ],
          "where": {
              "$and": [
                  {
                      "like_user_id": {
                          "$eq": likeby_user_id
                      }
                  },
                  {
                      "likeby_user_id": {
                          "$eq": like_user_id
                      }
                  }
              ]
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_query, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result.length);
    if(result.length!=0){
      //insertmatch(User_id,likedBy_user_id,auth,res);
      console.log("insert match called");
    }
    else {
      console.log(result);
    }
    console.log(result);
    res.send(result);
  })
  .catch(function(error) {
    console.log('Request Failed :' + error);

  });
}


function UpdateUsersTablePP(hasura_id, image, res, prev_result){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6820ea7f878a847624818f78081df55e9791ae18bcc67b4b"
    }
  };

  var body = {
      "type": "update",
      "args": {
          "table": "Users",
          "where": {
              "id": {
                  "$eq": hasura_id
              }
          },
          "$set": {
              "fileid": image
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_query, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(result);
    res.send(prev_result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
}

function UploadPP(image, imageType, res){
  var requestOptions = {
  	method: 'POST',
  	headers: {
        "Authorization": "Bearer a4d5300e57df6d1e699d021f6fc680e4e932f76625788483",
        "content-type" : imageType
  	},
  	body: image
  }

  fetchAction(url_file_upload, requestOptions)
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
    UpdateUsersTable(result.hasura_id, res);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
    res.send('Request Failed:' + error);
  });
}

function UpdateUsersTable(hasura_id, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6820ea7f878a847624818f78081df55e9791ae18bcc67b4b"
    }
  };

  var body = {
      "type": "insert",
      "args": {
          "table": "Users",
          "objects": [
              {
                  "id": hasura_id,
                  "fileid": "null"
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
  	console.log(result);
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
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
