  // Saves options to chrome.storage.sync.
  function saveOptions() {
    var source = $("#buttons input:checked").val();
    var input = null;
    if (source == 'twitter' || source == 'flickr') {
      input = $('input[name=' + source + '_input]').val();
    }
    chrome.storage.sync.set({
      source: source,
      input : input
    }, function() {
      // Send message to testscript.js
      chrome.runtime.sendMessage({source: "test"});
      console.log("sent");
      // Close pop-up window
      window.close();
    });
  }

// Restores values using the preferences stored in chrome.storage.
function restoreOptions() {
  // Default selection: twitter account @OfficialJaden
  chrome.storage.sync.get({
    source: 'twitter',
    input: '@OfficialJaden'
  }, function(items) {
    var source = items.source;
    var input = items.input;
    $('input:radio[name="source"]').val([source]);
    if (source == 'twitter' || source == 'flickr') {
      $('input[name=' + source + '_input]').val(input);
    }
  });
}

function misc() {
  // select corresponding radio button when text box selected
  $("input[type=text]").click(function() {
    var name = $(this).attr('name');
    var source = name.split('_')
    $('input:radio[name="source"]').val([source[0]]);
  });

  // focus corresponding text box when radio button selected
  $("input[type=radio]").click(function(){
    var source = $(this).attr('value');
    $('input[name=' + source + '_input]').focus();
  });

  // clear text box when change to different option
  $("input[type=radio]").click(function(){
   $("input[type=text]").val('');
 }); 

 // clear text box when chage to different option
 $("input[type=text]").click(function() {
  $("input[type=text]").val('');
});
}


document.addEventListener('DOMContentLoaded', misc);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);