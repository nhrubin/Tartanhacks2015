$(document).ready(function() {
  getOptions(setContent);
});

function setContent(source, input) {
  contentToUse = source;
  if (contentToUse == 'wiki') {
    wikiContent(replaceContents);
  } else if (contentToUse == 'fun_facts') {
    factsContent(replaceContents);
  } else if (contentToUse == 'quotes') {
    quotesContent(replaceContents);
  } else if (contentToUse == 'flickr') {
    flickrContent(input, replaceContents);
  }
}

function getOptions(callback) {
  // Default selection: twitter account @AvoidComments
  chrome.storage.sync.get({
    source: 'twitter',
    input: '@AvoidComments'
  }, function(items) {
    var source = items.source;
    var input = items.input;
    callback(source, input);
  });
}

function replaceContents(newContents) {
  $("#watch-discussion").replaceWith(newContents);
  $(".Contributions").replaceWith("");
  first = true;
  $("div").each(function() {
    var regex = /(comment|disqus)+/i;
    if (this.id.match(regex) || this.className.match(regex)) {
      if($(this).length > 0) {
       if (first) {
         first = false;
         $(this).replaceWith(newContents);
       } else {
         $(this).replaceWith("");
       }
     }
   }
 });
}

//quotes
function quotesContent(callback) {
  	var xhrArray=[];
    var resultArray=[];
	var numQuotes = 20;

    var statechange=function(arrIndex) {
      return function() {
        if(xhrArray[arrIndex].readyState===4) {
          ItemResponse(arrIndex,resultArray,xhrArray);
          AllResponses(resultArray,xhrArray,numQuotes,callback);
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
}

function ItemResponse(idx,resultArray,xhrArray) {
  if(xhrArray[idx].status===200) {
	    var xhr = xhrArray[idx];
        json = JSON.parse(xhr.responseText);
		var author = json["author"];
		var quote = json["quote"];
		var category = json["category"]; //Movies or Famous
		if(category.localeCompare("Movies")==0){
			resultArray[idx] = '<p>"'+quote+'" -<p3>'+author+'</p3></p><hr>';
		}
		else{
			resultArray[idx] = '<p>"'+quote+'" -<p2>'+author+'</p2></p><hr>';
		}
   }
}

function AllResponses(resultArray,xhrArray,num,callback) {
  var i,isAllComplete=true,isAllCompleteSucc=true;
   for(i=0;i<num;i++) if((!xhrArray[i])||(xhrArray[i].readyState!==4)) {
     isAllComplete=false;
     break;
   }
   if(isAllComplete) {
	 var text = '<style>@charset "utf-8";body {}'+
'#commentreplacement {width: 100%;overflow: scroll;max-height: 400px;background-color: #FFFFFF;-webkit-box-shadow: 3px 3px #606060;box-shadow: 3px 3px #606060;border-radius: 0px 10px 10px;border: medium solid #9F9F9F;}'+
'#commentreplacement p {border-bottom-color: #A3A3A3;border-top-color: #A3A3A3;padding-left: 10px;margin-left: 10px;margin-right: 10px;margin-bottom: 10px;margin-top: 10px;font-size: medium;line-height: 400%;text-align: center;}'+
'#commentreplacement p p2 {font-weight: bold;}'+
'#commentreplacement p p3 {font-style: italic;}'+
'#commentreplacement #commentReplacementItems {padding-top: 5px;padding-bottom: 5px;padding-left: 5px;padding-right: 5px;}'+
'#commentreplacement #commentReplacementItems h2 {display: inline-table;text-align: center;width: 100%;border-bottom-style: solid;margin-top: 0px;margin-bottom: 0px;line-height: 200%;border-bottom-color: #696969;}'+
'#commentReplacementHeader p {background-color: #FFFFFF;width: 30%;height: 100%;margin-top: 0px;margin-bottom: 0px;padding-top: 0px;padding-bottom: 0px;line-height: 300%;font-weight: bold;font-size: medium;text-align: center;border-top-left-radius: 10px;border-top-right-radius: 10px;border-color: #9F9F9F;border-left-style: solid;border-right-style: solid;border-top-style: solid;border-left-width: medium;border-right-width: medium;border-top-width: medium;}'+
'#commentfillerphotolist {margin: 0;padding: 0;list-style: none;}'+
'#commentfillerphotolist li {float: left;width: 45%;margin: 2.5%;}'+
'#commentfillerphotolist li img {width: 90%;margin-left: 5%;margin-right: 5%;}'+
'#commentfillerphotolist li a p {margin: 0;padding: 5%;font-size: 0.75em;color: #bdc3c7;}'+
'#commentreplacement #commentReplacementItems hr {width: 100%;color: #a9a9a9;background-color: #a9a9a9;height: 1px;}</style>';
   	 text += '<div id="commentReplacementHeader"><p>CommentHider: Quotes</p></div><div id="commentreplacement"><div id="commentReplacementItems">';
     for(i=0;i<resultArray.length;i++){
		 if(xhrArray[i].status==200) {
       		text += resultArray[i];
		 }
		 else{
			text += "<p>"+statusText+"</p>";
		 }
     }
	 text += "</div></div>";
     callback(text);
   }
}

function factsContent(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://numbersapi.p.mashape.com/random", true);
  xhr.setRequestHeader("X-Mashape-Key","12jk2SC0fumshzKBfoL1b80sFHuAp1zVJrHjsnpXTrIJDFEd3u");
  xhr.setRequestHeader("Accept", "text/plain");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback('<div><p>'+xhr.responseText+'</p></div>');
    }
  }
  xhr.send();
}

function flickrContent(keyword, callback) {
  var flickrAPI = "";
  flickrAPI += "https://api.flickr.com/services/rest/?";
  flickrAPI += "&method=flickr.photos.search";
  flickrAPI += "&api_key=44102463fa0ebbb239525d05370047b7";
  flickrAPI += "&text=" + keyword;
  flickrAPI += "&privacy_filter=1&accuracy=1&safe_search=1&content_type=1&media=photos&geo_context=0";
  flickrAPI += "&per_page=10"
  flickrAPI += "&format=json";

  flickrAPI += "&nojsoncallback=1";


  var xhr = new XMLHttpRequest();
  xhr.open("GET",flickrAPI,true);   // 
  xhr.send();
  xhr.onreadystatechange = function(){
    if(xhr.readyState==4) {
      var responseArray = JSON.parse(xhr.responseText);
      createPhotoList(responseArray, callback);
    }
  }
}

function createPhotoList(responseArray, callback) {
  var photosArray = responseArray.photos.photo;
  var text = '<div id="wrapper"><section><ul id="projects">';
  for (i=0; i<photosArray.length;i++) {
    var photo = photosArray[i];
    var imgSrc = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server
    + '/' + photo.id + '_' + photo.secret + '.jpg';
    text += '<li><img src=' + imgSrc + ' alt=""></li>';
  }
  text += '</ul></section>'
  callback(text);
}



function wikiContent(callback) {
  var xhr = new XMLHttpRequest();
  var curUrl = window.location.href;
  xhr.open("GET", "https://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?apikey=f9c7e68cc2f1b2f6725cb90dfeabb313288c3dff&url="+curUrl+"&outputMode=json&maxRetrieve=20&sourceText=raw", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      intermediate(jQuery.parseJSON(xhr.responseText), callback);
    }
  }
  xhr.send();
}

function intermediate(data, callback) {
  processData(data['entities'], "", callback);
}

function processData(data, accum, callback) {
  if (data.length == 0) {
    callback(accum);
    return;
  }
  el = data[0];
  data.splice(0,1);
  getWiki(el.text, data, processData, accum, callback);
}

function getWiki(topic, data, callback, accum, callback2) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects&exsentences=3&titles="+encodeURI(topic)+"&format=json&callback=?", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      data2 = jQuery.parseJSON(xhr.responseText.substring(5, xhr.responseText.length-1));
      thing = data2.query.pages;
      for (var key in thing) {
       if (key < 0) {
         callback(data, accum, callback2);
         return;
       }
       thing2 = thing[key].extract;
     }
     if (thing2.length > 50 && thing2.indexOf("This is a redirect") < 0) {
       callback(data, accum+thing2+" <a href='http://en.wikipedia.org/wiki/"+encodeURI(topic)+"' target='_blank'>Read more</a><br /><br />", callback2);
     } else {
       callback(data, accum, callback2);
     }
   }
 }
 xhr.send();
}

