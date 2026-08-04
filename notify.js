/**
 * Nexus Notification System
 * Safe error handling for all cordova plugins
 */

document.addEventListener('deviceready', function () {
  console.log('✓ Device Ready - Initializing Nexus...');

  // 1. Background Mode - Safe check
  try {
    if (window.cordova && cordova.plugins && cordova.plugins.backgroundMode) {
      cordova.plugins.backgroundMode.setDefaults({
        title: 'Nexus',
        text: 'Messenger is running',
        silent: false,
        hidden: false
      });
      cordova.plugins.backgroundMode.enable();
      console.log('✓ Background Mode enabled');
    } else {
      console.warn('⚠ Background Mode plugin not available');
    }
  } catch (e) {
    console.error('Background Mode error:', e);
  }

  // 2. Load Socket.IO and handle messages
  try {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.min.js';
    script.onload = function () {
      console.log('✓ Socket.IO loaded');
      try {
        if (typeof io !== 'undefined') {
          var socket = io('https://hemel24-massanger.hf.space', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            transports: ['websocket', 'polling']
          });

          socket.on('connect', function() {
            console.log('✓ Connected to server');
          });

          socket.on('disconnect', function() {
            console.log('✗ Disconnected from server');
          });

          socket.on('receive_message', function (msg) {
            console.log('📨 Message received:', msg);
            if (document.hidden) {
              handleNotification(msg);
            }
          });
        }
      } catch (e) {
        console.error('Socket.IO error:', e);
      }
    };
    script.onerror = function() {
      console.warn('⚠ Failed to load Socket.IO');
    };
    document.head.appendChild(script);
  } catch (e) {
    console.error('Script loading error:', e);
  }

  // 3. Request Permissions - Safe check
  try {
    if (window.cordova && cordova.plugins && cordova.plugins.permissions) {
      var p = cordova.plugins.permissions;
      p.requestPermissions(
        [p.CAMERA, p.RECORD_AUDIO, p.READ_EXTERNAL_STORAGE, p.WRITE_EXTERNAL_STORAGE, p.POST_NOTIFICATIONS],
        function() { console.log('✓ Permissions granted'); },
        function(e) { console.warn('⚠ Permissions error:', e); }
      );
    } else {
      console.warn('⚠ Permissions plugin not available');
    }
  } catch (e) {
    console.error('Permissions error:', e);
  }

}, false);

/**
 * Safe notification handler
 */
function handleNotification(msg) {
  try {
    if (window.cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
      cordova.plugins.notification.local.schedule({
        id: Date.now(),
        title: msg.sender || 'Nexus',
        text: msg.message || 'New message received',
        foreground: true,
        vibrate: true,
        sound: true,
        silent: false,
        priority: 'high'
      });
      console.log('✓ Notification sent');
    } else {
      console.warn('⚠ Notification plugin not available');
    }
  } catch (e) {
    console.error('Notification error:', e);
  }
}

/**
 * Global notification sender function
 */
window.sendNexusNotification = function(title, message, options) {
  options = options || {};
  try {
    if (window.cordova && cordova.plugins && cordova.plugins.notification && cordova.plugins.notification.local) {
      cordova.plugins.notification.local.schedule({
        id: options.id || Date.now(),
        title: title || 'Nexus',
        text: message || 'Notification',
        foreground: options.foreground !== false,
        vibrate: options.vibrate !== false,
        sound: options.sound !== false,
        silent: options.silent === true,
        priority: options.priority || 'high'
      });
    }
  } catch (e) {
    console.error('Send notification error:', e);
  }
};

console.log('✓ Nexus notification system loaded');
