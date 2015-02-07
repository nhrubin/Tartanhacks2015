// Saves options to chrome.storage
function save_options() {
  var text = $("#buttons input:checked").val();
  console.log(text);
  localStorage['text'] = text;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  /*chrome.storage.sync.get({
    text: 'should not happen',
  }, function(items) {
    console.log("restoring "+text);
  });*/
  text = localStorage['text'];
  console.log("loaded: "+text);
  $('#buttons input[value="'+text+'"]').prop("checked", true);
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
