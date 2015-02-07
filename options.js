  // Saves options to chrome.storage.sync.
  function saveOptions() {
    var source = $("#buttons input:checked").val();
    var input = null;
    if (source == 'twitter' || source == 'flickr' || source == 'instagram') {
      input = $('input[name=' + source + '_input]').val();
    }
    chrome.storage.sync.set({
      source: source,
      input : input
    }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
  }

// Restores values using the preferences stored in chrome.storage.
function restoreOptions() {
  // Default selection: twitter account @AvoidComments
  chrome.storage.sync.get({
    source: 'twitter',
    input: '@AvoidComments'
  }, function(items) {
    var source = items.source;
    var input = items.input;
    $('input:radio[name="source"]').val([source]);
    if (source == 'twitter' || source == 'flickr' || source == 'instagram') {
      $('input[name=' + source + '_input]').val(input);
    }
  });
}

function misc() {
  $("input[type=text]").click(function() {
    var name = $(this).attr('name');
    var source = name.split('_')
    $('input:radio[name="source"]').val([source[0]]);
  });

  $("input[type=radio]").click(function(){
      var source = $(this).attr('value');
      $('input[name=' + source + '_input]').focus();
  });

  $("input[type=radio]").click(function(){
   $("input[type=text]").val('');
 }); 

  $("input[type=text]").click(function() {
    $("input[type=text]").val('');
  });
}


document.addEventListener('DOMContentLoaded', misc);
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
  saveOptions);