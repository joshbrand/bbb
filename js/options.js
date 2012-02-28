/*
 * Buildbot Button Chrome Extension
 *
 * Copyright 2010, Peter Parente. All rights reserved.
 * http://creativecommons.org/licenses/BSD/
 */
var token = null;
function b64_encode(input) {
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {

                chr1 = input[i++];
                chr2 = input[i++];
                chr3 = input[i++];

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                        enc4 = 64;
                }

                output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
}

function _makeAuth(user, password) {
  var tok = user + ':' + password;
  var hash = b64_encode(tok);
  return "Basic " + hash;
}
function onSave() {
    var url = document.getElementById('baseUrl').value;
    var user = document.getElementById('user').value;
    var password = document.getElementById('password').value;
    if(url.charAt(url.length-1) == '/') {
        // strip trailing /
        url = url.substr(0, url.length-1)
    }
    localStorage['baseUrl'] = url;
    if (user != "" && password != "") {
      localStorage['auth'] = _makeAuth(user, password)
    } else {
      localStorage['auth'] = null;
    }
    localStorage['builders'] = document.getElementById('builders').value;
    localStorage['frequency'] = document.getElementById('frequency').value;
    localStorage['sounds'] = document.getElementById('sounds').checked;
    _showStatus();
}

function _showStatus() {
    var node = document.getElementById('status');
    node.style.visibility = '';
    if(token) clearTimeout(token);
    token = setTimeout(function() {
        node.style.visibility = 'hidden';
        token = null;
    }, 3000);
    var bg = chrome.extension.getBackgroundPage();
    bg.scheduleUpdate(true);
}

window.onload = function() {
    document.getElementById('baseUrl').value = localStorage['baseUrl'] || '';
    document.getElementById('user').value = localStorage['user'] || '';
    document.getElementById('password').value = localStorage['password'] || '';
    document.getElementById('builders').value = localStorage['builders'] || '';
    document.getElementById('frequency').value = localStorage['frequency'] || '30';
    if(localStorage['sounds'] == 'true') {
        document.getElementById('sounds').checked = true;
    }
}
