  setTimeout(function () {
    console.log("time");
    document.querySelector("[href^='tel:']").onclick = function(event) { 
        event.preventDefault();
        var tel = this.getAttribute("href").split(":").pop();
        console.log("GD: Calling " + tel);
        chrome.runtime.sendMessage(tel);
    }
}, 5000);
    

