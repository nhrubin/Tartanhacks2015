$(document).ready(function() {
  console.log('here');
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
      resultArray[idx] = '<p>"'+quote+'" -"'+author+'"</p>';
    }
    else{
      resultArray[idx] = '<p>"'+quote+'" -'+author+'</p>';
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

function wikiContent(callback) {
  var xhr = new XMLHttpRequest();
  var curUrl = window.location.href;
  xhr.open("GET", "https://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?apikey=f9c7e68cc2f1b2f6725cb90dfeabb313288c3dff&url="+curUrl+"&outputMode=json&maxRetrieve=10", true);
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
  xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&exsentences=3&titles="+encodeURI(topic)+"&format=json&callback=?", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      data2 = jQuery.parseJSON(xhr.responseText.substring(5, xhr.responseText.length-1));
      thing = data2.query.pages;
      for (var key in thing) {
	if (key < 0) callback(data, accum, callback2);
	thing2 = thing[key].extract;
      }
      if (thing2.length > 50) {
	callback(data, accum+thing2+"<br /><br />", callback2);
      } else {
	callback(data, accum, callback2);
      }
    }
  }
  xhr.send();
}

