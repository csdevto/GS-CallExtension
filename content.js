
 chrome.storage.sync.get({
    IPV: '',
  }, function(items) {
function ReplacePhoneNumbers(oldhtml) {
var countrycodes = ["1","52","57"];
var delimiters = "-|\\.|—|–|&nbsp;"
var phonedef = "\\+?(?:(?:(?:" + countrycodes + ")(?:\\s|" + delimiters + ")?)?\\(?[2-9]\\d{2}\\)?(?:\\s|" + delimiters + ")?[2-9]\\d{2}(?:" + delimiters + ")?[0-9a-z]{4})"
var spechars = new RegExp("([- \(\)\.:]|\\s|" + delimiters + ")","gi") //Special characters to be removed from the link
var phonereg = new RegExp("((^|[^0-9])(href=[\"']tel:)?((?:" + phonedef + ")[\"'][^>]*?>)?(" + phonedef + ")($|[^0-9]))","gi","([- \(\)\.:]|\\s|" + phonedef + ")")
    IPV = items.IPV
    newhtml = oldhtml
newhtml = newhtml.replace(phonereg, function ($0, $1, $2, $3, $4, $5, $6) {
    if ($3) return $1;
    else if ($4) return $2+$4+$5+$6;
    else {

        n = "window.open('"+'http://'+IPV+'/cgi-bin/api-make_call?username=user&password=user&phonenumber='+ $5.replace(spechars,"") + '&account=0'+"','_blank','width=20,height=20,location=no,Scrollbars=no')";
        return $2+ '<a href="#" onclick="' +n+ '">'+$5+"</a>"+$6 }; }); 
return newhtml;
}
document.body.innerHTML = ReplacePhoneNumbers (document.body.innerHTML);
})