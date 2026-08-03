document.addEventListener('deviceready', function () {
  if (window.cordova.plugins.backgroundMode) {
    cordova.plugins.backgroundMode.setDefaults({
      title: 'Nexus is running',
      text: 'Waiting for new messages',
      silent: false
    });
    cordova.plugins.backgroundMode.enable();
  }

  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js';
  script.onload = function () {
    var socket = io('https://hemel24-massanger.hf.space');
    socket.on('receive_message', function (msg) {
      if (document.hidden) {
        cordova.plugins.notification.local.schedule({
          title: msg.sender || 'Nexus',
          text: msg.message || 'New message received',
          foreground: true,
          vibrate: true
        });
      }
    });
  };
  document.head.appendChild(script);
}, false);
