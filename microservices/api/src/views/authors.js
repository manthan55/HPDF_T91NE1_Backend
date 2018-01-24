//Static variables
var postsUrl = "https://jsonplaceholder.typicode.com/posts";

window.onload = function(){
	load();
}

function load(){
	$.getJSON(postsUrl, function(data) {
		for(var i=1; i<=10; i++){
			var count = data.filter(function(v){
				return v.userId == i
			}).length;
			$("[name="+i+"]").append(" <i>(Posts : "+count+")</i>");
		}
	});
}
