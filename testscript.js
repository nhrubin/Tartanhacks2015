$(document).ready(function() {
  var replaceHTML = "<div>Hiabcde</div>";
  $("#watch-discussion").replaceWith(replaceHTML);
  first = true;
  $("div").each(function() {
    var regex = /(comment|disqus)+/i;
    if (this.id.match(regex) || this.className.match(regex)) {
      if($(this).length > 0) {
	if (first) {
	  first = false;
	  $(this).replaceWith(replaceHTML);
	} else {
	  $(this).replaceWith("");
	}
	console.log('matches: '+this.id+" "+this.className);
      } else {
	console.log('here');
      }
    }
  });
});
