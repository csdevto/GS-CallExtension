
var iframe = document.createElement('iframe');
iframe.style.display = "none";
iframe.src = "";
document.body.appendChild(iframe);
function dial(num){
  var query = (num);
  console.log(query);
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

  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',

  }, function(items) {

    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ query + '&account=0';
    
  });
}};
chrome.runtime.onMessage.addListener(function (message) {
  console.log("number received: " + message);
  dial(message);
});
chrome.contextMenus.create({
  id:'1',
 title: "Call Number:  %s",
 contexts:["selection"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  dial(info.selectionText);
});

