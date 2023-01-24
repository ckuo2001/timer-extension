var countdown = 0;
function getTimerInput() {
  countdown = 3600 * document.getElementById('hour').value + 60 * document.getElementById('minute').value + 1 * document.getElementById('second').value;
  var endTime = new Date(document.getElementById('end-time').value).getTime();
    if (countdown && endTime) {
      alert("Please only choose one input method");
    } else {
      if (endTime) {
        var now = new Date().getTime();
        countdown = Math.floor((endTime - now) / 1000);
      }

      document.getElementById('hour').value = "";
      document.getElementById('minute').value = "";
      document.getElementById('second').value = "";

      port.postMessage({count: countdown});
    }
}

function sendMessageToContent(countdown) {
  chrome.runtime.sendMessage(countdown, function(response) {
    console.log(`message from background: ${JSON.stringify(response)}`);
  });
}

let progressStartValue = 0;
let circularProgress = document.querySelector(".circular-progress");
let progressValue = document.querySelector(".progress-value");

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;

    progressValue.textContent = request.display;
    circularProgress.style.background = `conic-gradient(#7d2ae8 ${(request.count/countdown) * 360}deg, #ededed 0deg)`
    if (request.zero == true) {
      alertPopup();
    }
  }
);

function alertPopup() {
  alert("Time's up!");
  document.getElementById('stop').disabled = true;
  document.getElementById('start').disabled = false;
  circularProgress.style.background = `conic-gradient(#7d2ae8 ${0}deg, #ededed 0deg)`
}

document.getElementById('start').addEventListener('click', getTimerInput);
document.getElementById('stop').addEventListener('click', function() {
  countdown = 0;
  port.postMessage({count: countdown})
});

var port = chrome.runtime.connect({name: 'timer'});

port.onMessage.addListener(function(msg) {
  document.getElementById('start').disabled = true;
  document.getElementById('stop').disabled = false;

  progressValue.textContent = msg.display;
  circularProgress.style.background = `conic-gradient(#7d2ae8 ${(msg.count/countdown) * 360}deg, #ededed 0deg)`
  if (msg.zero == true) {
    alertPopup();
  }
});