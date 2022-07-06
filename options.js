// Saves options to chrome.storage.sync.
function save_options() {
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
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
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

function callforward(){
  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',
    PHONEV: '',
    FAACTIVATED: '',
  }, function(items) {
    Fnumber = '';
    if (items.FAACTIVATED == 0){
      chrome.storage.sync.set({
      FAACTIVATED: '1',
    });
    Fnumber = '*72,' + items.PHONEV + ',,,,,,,,,1';
    }else {
      chrome.storage.sync.set({
      FAACTIVATED: '0',
    });
    Fnumber = '*73';
    }
    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ Fnumber + '&account=0';
      var status = document.getElementById('number');
  status.className = 'alert alert-success';
    status.textContent ='Call Forwarded to ' + items.PHONEV;
    });
}
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
      var status = document.getElementById('number');
  status.className = 'alert alert-danger';
    status.textContent ='Call Ended';
    });
}
hcall = 0;
function holdcall(){
  chrome.storage.sync.get({
    IPV: '',
    USERV: '',
    PASSWORDV: '',
    PHONEV: '',
    FAACTIVATED: '',
  }, function(items) {
    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-phone_operation?passcode=' + items.PASSWORDV + '&cmd=holdcall';
      var status = document.getElementById('number');
  if (hcall == 1){
    status.className = 'alert alert-success';
    status.textContent ='Call Resumed';
    hcall = 0;
  }else if (hcall == 0){
    status.className = 'alert alert-warning';
    status.textContent ='Call On Hold';
    hcall = 1;
  }
    
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('CallForward').addEventListener('click',
    callforward);
document.getElementById('endcall').addEventListener('click',
    endcall);
document.getElementById('holdcall').addEventListener('click',
    holdcall);
