window.onload = function(){
  window.jQuery ? console.log('jQuery is loaded') : console.log('jQuery is not loaded');
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1578440922251720',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.11'
  });

  FB.AppEvents.logPageView();

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 function checkLoginState() {
     FB.getLoginStatus(function(response) {
       console.log(response);
       if(response.status === "connected"){
         console.log("We are connected!");
       } else if(response.status === "not_authorized"){
         console.log("We are not connected!");
       } else {
         console.log("You are not logged into Facebook");
       }
     });
   }

   function Login(){
     FB.login(function(response){
       if(response.status === "connected"){
         console.log("We are connected!");
         console.log(response);
        //window.location="http://localhost:8080/signup/"+response.authResponse.accessToken+"";
       } else if(response.status === "not_authorized"){
         console.log("We are not connected!");
       } else {
         console.log("You are not logged into Facebook");
       }
     }, {scope: 'email'});
   }

   function getInfo() {
			FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
				console.log(response);
			});
		}

    function sendAuth(){
      $.ajax({
      	url: "https://api.burled79.hasura-app.io/signup1",
      	contentType: "application/json",
      	data: JSON.stringify({
            "data": {
                  "access_token": "EAAWblWp4QcgBADxRYmuIwuwOfi4NEIDAb6a3MsyDalNOPNa5L9FzBfrgQuezaHXkTC2wxJnZAqfKSTOBJQCRqMZArwxDxJuFA12HAmLfFMlmfPo0CeaQncm2IwA6b04iEzliKpP2Jwvp8cLBMCH3d81YLMn5AFgduTeLYyHJpr6M6A4KX69Gv4fLOod2axRKTdUfpmugZDZD"
            }
      	}),
      	type: "POST",
      	dataType: "json"
      }).done(function(json) {
      	// Handle Response
      	// To save the auth token received to offline storage
      	// var authToken = result.auth_token
      	// window.localStorage.setItem('HASURA_AUTH_TOKEN', authToken);
        console.log("sent!");
        console.log(json);
      }).fail(function(xhr, status, errorThrown) {
      	console.log("Error: " + errorThrown);
      	console.log("Status: " + status);
      	console.dir(xhr);
      });
    }

    function postReq(){
      $.ajax({
      	url: "https://auth.burled79.hasura-app.io/v1/signup",
      	contentType: "application/json",
      	data: JSON.stringify({
            "provider": "facebook",
            "data": {
                  "access_token": "EAAWblWp4QcgBADxRYmuIwuwOfi4NEIDAb6a3MsyDalNOPNa5L9FzBfrgQuezaHXkTC2wxJnZAqfKSTOBJQCRqMZArwxDxJuFA12HAmLfFMlmfPo0CeaQncm2IwA6b04iEzliKpP2Jwvp8cLBMCH3d81YLMn5AFgduTeLYyHJpr6M6A4KX69Gv4fLOod2axRKTdUfpmugZDZD"
            }
      	}),
      	type: "POST",
      	dataType: "json"
      }).done(function(json) {
      	// Handle Response
      	// To save the auth token received to offline storage
      	// var authToken = result.auth_token
      	// window.localStorage.setItem('HASURA_AUTH_TOKEN', authToken);
        console.log(json);
      }).fail(function(xhr, status, errorThrown) {
      	console.log("Error: " + errorThrown);
      	console.log("Status: " + status);
      	console.dir(xhr);
      });
    }
