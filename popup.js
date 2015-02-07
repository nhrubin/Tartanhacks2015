$(document).ready(function() {
  $("#options").click(function(){
    chrome.tabs.create({'url': chrome.extension.getURL('options.html')});
  });
});
