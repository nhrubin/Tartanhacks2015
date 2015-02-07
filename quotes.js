$(document).ready(function() {
	var xhrArray=[];
    var resultArray=[];
	var numQuotes = 20;

    var statechange=function(arrIndex) {
      return function() {
        if(xhrArray[arrIndex].readyState===4) {
          ItemResponse(arrIndex,resultArray,xhrArray);
          AllResponses(resultArray,xhrArray,numQuotes);
        }
      }
    }

    for(var i=0; i<numQuotes; i++) {
	  var xhr = new XMLHttpRequest();
      xhrArray[i]=xhr;
      xhr.open("POST", "https://andruxnet-random-famous-quotes.p.mashape.com/cat=movies", true);
	  xhr.setRequestHeader("X-Mashape-Key", "12jk2SC0fumshzKBfoL1b80sFHuAp1zVJrHjsnpXTrIJDFEd3u");
	  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  xhr.setRequestHeader("Accept", "application/json");
      xhrArray[i].onreadystatechange=statechange(i);
      xhrArray[i].send();
    }
});



 function ItemResponse(idx,resultArray,xhrArray) {
   if(xhrArray[idx].status===200) {
	    var xhr = xhrArray[idx];
        json = JSON.parse(xhr.responseText);
		var author = json["author"];
		var quote = json["quote"];
		var category = json["category"]; //Movies or Famous
		if(category.localeCompare("Movies")==0){
			resultArray[idx] = '<p>"'+quote+'" -"'+author+'"</p>';
		}
		else{
			resultArray[idx] = '<p>"'+quote+'" -'+author+'</p>';
		}
   }
 }

 function AllResponses(resultArray,xhrArray,num) {
   var i,isAllComplete=true,isAllCompleteSucc=true;
   for(i=0;i<num;i++) if((!xhrArray[i])||(xhrArray[i].readyState!==4)) {
     isAllComplete=false;
     break;
   }
   if(isAllComplete) {
   	 var text = '<div id="contentreplacement">';
     for(i=0;i<resultArray.length;i++){
		 if(xhrArray[i].status==200) {
       		text += resultArray[i];
		 }
		 else{
			text += "<p>"+statusText+"</p>";
		 }
     }
	 text += "</div>";
	 $("#watch-discussion").replaceWith(text);
   }
 }