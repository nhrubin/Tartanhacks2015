$(document).ready(function() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://numbersapi.p.mashape.com/random", true);
	xhr.setRequestHeader("X-Mashape-Key","12jk2SC0fumshzKBfoL1b80sFHuAp1zVJrHjsnpXTrIJDFEd3u");
	xhr.setRequestHeader("Accept", "text/plain");
	var random = "hey";
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
		    $("#watch-discussion").replaceWith('<div><p>'+xhr.responseText+'</p></div>');
  		}
	}
	xhr.send();
    var test = "data";
});
