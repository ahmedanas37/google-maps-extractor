const FEEDBACK_URL="https://forms.gle/p5n1rDnwmrBWMQ3X6";
chrome.runtime.onInstalled.addListener(function(a){"install"===a.reason&&chrome.runtime.setUninstallURL&&chrome.runtime.setUninstallURL(FEEDBACK_URL)});
try{importScripts("js/mybg.js")}catch(a){console.error(a)};
