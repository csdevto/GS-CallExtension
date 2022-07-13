var hcall = 0;
var popup = 0;
var options = 0;
var NumStatus = '';
if(document.querySelectorAll('#GSPhonePopup').length > 0){
  popup = 1;
  NumStatus = document.getElementById('number');
}
if(document.querySelectorAll('#GSOptions').length > 0){
  options = 1;
}

function GSPhone(){
  var self = this;
  this.IP = '192.0.0.1';
  this.Username = 'user';
  this.Password = 'user';
  this.ForwardNum = '';
  this.ForwardAct = '';
  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',
    PHONEV: '',
    FAACTIVATED: '',
    
  }, function(items) {
    self.IP = items.IPV;
    self.Username = items.USERV;
    self.Password = items.PASSWORDV;
    self.ForwardAct = items.FAACTIVATED;
    self.ForwardNum = items.PHONEV;
  });
  
  this.Dial = function(number){
    console.log('dial using func func');
    var query = (number);
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
      if(popup == 1){
        NumStatus.className = 'alert alert-success';
        NumStatus.textContent ='Number Called: ' + query;
      }
      var opt = {
        type: "basic",
        title: "Dialing Number",
        message: query,
        iconUrl: "favicon.png",
        silent: true,
        priority: 2,
        buttons: [{title:"Dismiss"}, {title:"End Call"}]
      };
      chrome.notifications.create("", opt);
      document.querySelector('iframe').src = 
      'http://'+self.IP+'/cgi-bin/api-make_call?username=' + self.Username + '&password=' + self.Password + '&phonenumber='+ number + '&account=0';
    } 
  }
  this.End =function(){
    document.querySelector('iframe').src = 
    'http://'+self.IP+'/cgi-bin/api-phone_operation?passcode=' + self.Password + '&cmd=endcall';
    if(popup ==1){
      NumStatus.className = 'alert alert-danger';
      NumStatus.textContent ='Call Ended';
    }
    
  }
  this.Hold = function(){
    document.querySelector('iframe').src = 
    'http://'+self.IP+'/cgi-bin/api-phone_operation?passcode=' + self.Password + '&cmd=holdcall';
    if(popup ==1){
      
      if (hcall == 1){
        NumStatus.className = 'alert alert-success';
        NumStatus.textContent ='Call Resumed';
        hcall = 0;
      }else if (hcall == 0){
        NumStatus.className = 'alert alert-warning';
        NumStatus.textContent ='Call On Hold';
        hcall = 1;
      }
    }
  }
  this.Forwarder = function(){
    Fnumber = '';
    if (self.ForwardAct == 0){
      chrome.storage.sync.set({
        FAACTIVATED: '1',
      });
      Fnumber = '*72,' + self.ForwardNum + ',,,,,,,,,1';
    }else {
      chrome.storage.sync.set({
        FAACTIVATED: '0',
      });
      Fnumber = '*73';
    }
    document.querySelector('iframe').src = 
    'http://'+self.IP+'/cgi-bin/api-make_call?username=' + self.Username + '&password=' + self.Password +  '&phonenumber='+ Fnumber + '&account=0';
    
    NumStatus.className = 'alert alert-success';
    NumStatus.textContent ='Call Forwarded to ' + self.ForwardNum;
  }
  this.Restore = function(){
    chrome.storage.sync.get({
      IPV: '',
      USERV: '',
      PASSWORDV: '',
      PHONEV: '',
    }, function(items) {
      document.getElementById('IP').value = items.IPV;
      document.getElementById('USER').value = items.USERV;
      document.getElementById('PASSWORD').value = items.PASSWORDV;
      document.getElementById('PHONE').value = items.PHONEV;
    });
  }
  this.save_options = function(){
    var IPt = document.getElementById('IP').value;
    var USERt = document.getElementById('USER').value;
    var PASSWORDt = document.getElementById('PASSWORD').value;
    var PHONEt = document.getElementById('PHONE').value;
    chrome.storage.sync.set({
      IPV: IPt,
      PASSWORDV: PASSWORDt,
      USERV: USERt,
      PHONEV: PHONEt,
      FAACTIVATED: '0'
    }, function() {
      // Update NumStatus to let user know options were saved.
      var Status = document.getElementById('status');
      Status.textContent = 'Options saved.';
      setTimeout(function() {
        Status.textContent = '';
      }, 750);
    });
  }
  
}

var Call = new GSPhone();

if(popup == 0){
  var iframe = document.createElement('iframe');
  iframe.style.display = "none";
  iframe.src = "";
  document.body.appendChild(iframe);
}
chrome.runtime.onMessage.addListener(function (message) {
  console.log("number received: " + message);
  Call.Dial(message);
});
chrome.contextMenus.create({
  id:'1',
  title: "Call Number:  %s",
  contexts:["selection"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  Call.Dial(info.selectionText);
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  chrome.notifications.clear(notificationId);
  if (buttonIndex === 1) {
    Call.End();
  }
});


if(popup == 1){
  document.getElementById('CallForward').addEventListener('click',Call.Forwarder);
  document.getElementById('endcall').addEventListener('click',Call.End);
  document.getElementById('holdcall').addEventListener('click',Call.Hold);
}
if (options == 1){
  document.addEventListener('DOMContentLoaded', Call.Restore);
  document.getElementById('save').addEventListener('click',Call.save_options);
}

chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
  if (typeof selection !== 'undefined') {
    var query = (selection[0]);
    Call.Dial(query);
  }else{
    
    NumStatus.className = 'alert alert-danger';
    NumStatus.textContent ='Please select a Number';
  }}
  
  );
  
  