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
 console.log("loaded!");

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
       } else if(response.status === "not_authorized"){
         console.log("We are not connected!");
       } else {
         console.log("You are not logged into Facebook");
       }
     });
   }

   function getInfo() {
			FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
				console.log(response);
			});
		}
