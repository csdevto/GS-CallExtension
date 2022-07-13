let numberOfClicks = 0;
function incrementClicks() {
  numberOfClicks++;
}
var date = new Date();

const withinOneSecond = (time) => new Date().getTime() - new Date(time).getTime() < 1000; 

function ChangeHREF(){
  incrementClicks();
  var PhoneNums = document.querySelectorAll("[href^='tel:']"); 
  PhoneNums.forEach(PhoneNum => {
    PhoneNum.removeEventListener('click',incrementClicks);
    PhoneNum.addEventListener('click',function handleClick(e){
      var tel = PhoneNum.getAttribute("href").split(":").pop();
      event.preventDefault();
      if(withinOneSecond(date)==false){
      console.log("Grandstream CTC: Calling " + tel);
      chrome.runtime.sendMessage(tel);
      date = new Date();
    }
    }, {once : true});
    
    
  });
}

window.addEventListener('load', function() {
  ChangeHREF();
  setInterval(function () {
    ChangeHREF();
  }, 3000); 
});
