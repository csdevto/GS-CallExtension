//fuction to keep track of how many times changeHREF loops
let numberOfClicks = 0;
function incrementClicks() {
  numberOfClicks++;
}

//current setup once a phone number is clicked because of the loop it sends the call twice, to prevent this, the changeHREF function checks that the response send is only one in a second.
var date = new Date();
const withinOneSecond = (time) => new Date().getTime() - new Date(time).getTime() < 1000; 

//a recursive fuction that checks the page for all HREF='TEL links and adds a listener that disables the usual behavior of the click and instead reroutes it to the extension using chrome sendmessage funtion
function ChangeHREF(){
  incrementClicks();
  var PhoneNums = document.querySelectorAll("[href^='tel:']"); 
  PhoneNums.forEach(PhoneNum => {
    PhoneNum.removeEventListener('click',incrementClicks);
    PhoneNum.addEventListener('click',function handleClick(e){
      var tel = PhoneNum.getAttribute("href").split(":").pop();
      event.preventDefault();
      if(withinOneSecond(date)==false){
      //console.log("Sent to call: " + tel);
      chrome.runtime.sendMessage(tel);
      date = new Date();
    }
    }, {once : true});
    
    
  });
}
// a loop is required after the page has been loaded, some pages built using react or node as backend dont reload the page when opening a link, set interval just refreshes the links every 3 seconds
window.addEventListener('load', function() {
  ChangeHREF();
  setInterval(function () {
    ChangeHREF();
  }, 3000); 
});
