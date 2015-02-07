$(document).ready(function() {
  console.log('here');
  contentToUse = 'facts';
  if (contentToUse == 'wiki') {
    wikiContent(replaceContents);
  } else if (contentToUse == 'facts') {
    factsContent(replaceContents);
  }
});

function replaceContents(newContents) {
  console.log("-->"+newContents+"<--");
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
	console.log('matches: '+this.id+" "+this.className);
      } else {
	console.log('here');
      }
    }
  });
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
  console.log('getting wiki content');
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?apikey=f9c7e68cc2f1b2f6725cb90dfeabb313288c3dff&url=https://en.wikipedia.org/wiki/Main_Page&outputMode=json&maxRetrieve=10", true);
  xhr.onreadystatechange = function() {
    intermediate(jQuery.parseJSON(xhr.responseText), callback);
  }
  xhr.send();
}

function intermediate(data, callback) {
  processData(data['entities'], "", callback);
}

function processData(data, accum, callback) {
  console.log("VVV");
  console.log(data);
  if (data.length == 0) callback(accum);
  el = data[0];
  data.splice(0,1);
  getWiki(el.text, data, processData, accum, callback);
}

function getWiki(topic, data, callback, accum, callback2) {
  console.log("====="+topic);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&exsentences=3&titles="+encodeURI(topic)+"&callback=?", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    console.log('in here');
    console.log(xhr);
    console.log(xhr.responseText);
    data = jQuery.parseXML(xhr.responseText);
    console.log(data);
    thing = data.query.pages;
    for (var key in thing) {
      thing2 = thing[key].extract;
    }
    console.log(thing2);
    if (thing2.length > 50) {
      callback(data, accum+thing2+"<br /><br />", callback2);
    } else {
      callback(data, accum, callback2);
    }
  }
  xhr.send();
}

