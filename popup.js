$(document).ready(function() {
  $("#options").click(function(){
    chrome.tabs.create({'url':'chrome://extensions?options=bndpchigejlbifakgcdbejahlnojmocj'});
  });
});
