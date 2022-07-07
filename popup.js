chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
  var query = (selection[0]);
  if (query.length >0 ) {
    if(query.substring(0, 2) === '+1'){
      query = query.substr(1);
      console.log('+1');
        }  else if(query.charAt(0) === '+'){
  query = '011' + query.substr(1);
  console.log('+');
    }  
  query = query.replace(/[^0-9,]/gi, '');
	var status = document.getElementById('number');
	status.className = 'alert alert-success';
    status.textContent ='Number Called: ' + query;

  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',
  }, function(items) {
    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ query + '&account=0';
    });
}else{
	var status = document.getElementById('number');
	status.className = 'alert alert-danger';
    status.textContent ='Please select a Number';
}}

);
chrome.runtime.onMessage.addListener(function (message) {
  console.log("number received: " + message);
  dial(message);
});
