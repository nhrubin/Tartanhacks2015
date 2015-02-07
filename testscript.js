$(document).ready(function() {
  var replaceHTML = "<div>Hi</div>";
  $("#watch-discussion").replaceWith(replaceHTML);
  lastFound = null;
  $("div").each(function() {
    var regex = /(comment|disqus)+/i;
    if (this.id.match(regex) || this.className.match(regex)) {
      $(lastFound).replaceWith("");
      lastFound = this;
      console.log('matches: '+this.id+" "+this.className);
    }
  });
  $(lastFound).replaceWith(replaceHTML);
});
