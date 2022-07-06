var iframe = document.createElement('iframe');
iframe.style.display = "none";
iframe.src = "";
document.body.appendChild(iframe);
function dial(num){
  var query = (num);
  if (query.length >0 ) {
    if(query.charAt(0) === '+'){
  query = '011' + query.substr(1);
    }  
  query = query.replace(/[^0-9,]/gi, '');
  var status = document.getElementById('number');

  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',
  }, function(items) {
    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ query + '&account=0';
    });
}};
chrome.contextMenus.create({
 title: "Call Number:  %s",
 contexts:["selection"],  // ContextType
 onclick: function(info, tab) {
        dial(info.selectionText);
    }// A callback function
});
chrome.runtime.onMessage.addListener(function (message) {
  console.log("number received: " + message);
  dial(message);
});