
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
    var opt = {
      type: "basic",
      title: "Dialing Number",
      message: query,
      iconUrl: "favicon.png",
      priority: 2,
      buttons: [{title:"Dismiss"}, {title:"End Call"}]
  };
  chrome.notifications.create("", opt);
    chrome.storage.sync.get({
      IPV: '',
      USERV: '',
      PASSWORDV: '',
      
    }, function(items) {
      
      document.querySelector('iframe').src = 
      'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ query + '&account=0';
      
    });

  }};
  function endcall(){
    chrome.storage.sync.get({
      IPV: '',
      USERV: '',
      PASSWORDV: '',
      PHONEV: '',
      FAACTIVATED: '',
    }, function(items) {
      document.querySelector('iframe').src = 
      'http://'+items.IPV+'/cgi-bin/api-phone_operation?passcode=' + items.PASSWORDV + '&cmd=endcall';
      });
  }
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
  
  chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
    chrome.notifications.clear(notificationId);
    if (buttonIndex === 1) {
        endcall();
    }
        
});