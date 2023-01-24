var timer = "";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request > 0) {
      setTimer(request, sendResponse);
    } else {
      clearInterval(timer);
      console.log("clear");
      port.postMessage({display: "00:00:00", zero: true});
    }
    return true;
  });

function setTimer(countdown, port) {
    let remaining = "";
    timer = setInterval(function() {

      if (countdown == 0) {
        port.postMessage({display: "00:00:00", zero: true});
        clearInterval(timer);
      } else {
        remaining = "";
        var hr = Math.floor(countdown / 3600);
        var min = Math.floor((countdown % 3600) / 60);
        var sec = Math.floor((countdown % 3600) % 60);

        if (hr <10 ) {
          remaining += "0";
        }
        remaining += hr + ":";
        if (min < 10) {
          remaining += "0";
        }
        remaining += min + ":";
        if (sec <10) {
          remaining += "0";
        }
        remaining += sec;
        port.postMessage({count: countdown, display: remaining, zero: false});
        countdown--;
        }
  }, 1000);}

function sendMessageToContent(response) {
  chrome.runtime.sendMessage(response);
}

chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log(msg);
    if (msg.count > 0) {
      setTimer(msg.count, port);
    } else {
      clearInterval(timer);
      console.log("clear");
      port.postMessage({display: "00:00:00", zero: true});
    }
    return true;
  });
});