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
    FAACTIVATED: '0',
    DBN:'{"contact":[]}'
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
function dial(num){
  var query = (num);
  console.log(query);
  if (query.length >0 ) {
    if(query.substring(0, 2) === '+1'){
      query = '011' + query.substr(2);
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
    DBW:'',
    DBN:'',
  }, function(items) {

    console.log("t1" + items.DBN);
    document.querySelector('iframe').src = 
    'http://'+items.IPV+'/cgi-bin/api-make_call?username=' + items.USERV + '&password=' + items.PASSWORDV + '&phonenumber='+ query + '&account=0';
    var jsonStr = items.DBN;
    chrome.tabs.getSelected(null,function(tab) {
      var tablink = tab.url;
      console.log(tablink);
      
      var wbs = tablink;
      
      var obj = JSON.parse(jsonStr);
      obj['contact'].push({"website":wbs,"Number":query});
      jsonStr = JSON.stringify(obj);
      chrome.storage.sync.set({
        DBN: jsonStr,
      });
    });
    });
}else{
  var status = document.getElementById('number');
  status.className = 'alert alert-danger';
    status.textContent ='Please select a Number';
}}
function dialn(){
  var num = document.getElementById('CPNum').value;
  dial(num);
}
function  BTNStart(){
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('CallForward').addEventListener('click',
    callforward);
document.getElementById('endcall').addEventListener('click',
    endcall);
document.getElementById('holdcall').addEventListener('click',
    holdcall);
document.getElementById('dialnew').addEventListener('click',
    dialn);
}
function AppTable(){
      var t = $('#HisT').DataTable({
      "columnDefs": [ {
            "targets": -1,
            "data": null,
            "defaultContent": "<button id='PPCall'>Click!</button>"
        } ]
    });
      t.clear();
     chrome.storage.sync.get({
    DBN: '',
  },function(items) {
    jsonStr = items.DBN;
    var count = 0;
    var obj = JSON.parse(jsonStr);
    for (var i of obj['contact']) {
      t.row.add([i['website'],i['Number']]).draw();
      count++;
    }
   
  });
    $('#HisT').on('click', 'tbody #PPCall', function () {
    var data = t.row($(this).closest('tr')).data();
    dial(data[1]);
});
}
function deldb(){
  array = JSON.stringify({
    "contact":[]
});
  chrome.storage.sync.set({

        DBN: array,
      });
};
function getdb(){
   chrome.storage.sync.get({
    DBN:'',
  }, function(items) {
    console.log(items.DBN);
  })
}
function popcall(){
chrome.tabs.executeScript( {
  code: "window.getSelection().toString();"
}, function(selection) {
  var query = (selection[0]);
  dial(query);
  }

);}
chrome.contextMenus.create({
 title: "Call Number:  %s",
 contexts:["selection"],  // ContextType
 onclick: function(info, tab) {
        dial(info.selectionText);
    }// A callback function
});
