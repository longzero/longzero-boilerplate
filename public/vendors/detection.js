
//-----------------------------------------------------------------------------
// BROWSER/FEATURE DETECTION
//-----------------------------------------------------------------------------

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
if (isOpera) $('html').addClass('opera');

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
if (isFirefox) $('html').addClass('firefox');

// At least Safari 3+: "[object HTMLElementConstructor]"
// var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
if (isSafari) $('html').addClass('safari');

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE) $('html').addClass('ie');

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
if (isEdge) $('html').addClass('edge');

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
if (isChrome) $('html').addClass('chrome');

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;
if (isBlink) $('html').addClass('blink');

// Mouse movements
var hasMouse = false;
window.onmousemove = function() {
  hasMouse = true;
}

// TOUCH DETECTION
function isTouchDevice() {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};
function hasTouch() {
  return (('ontouchstart' in window) ||       // html5 browsers
          (navigator.maxTouchPoints > 0) ||   // future IE
          (navigator.msMaxTouchPoints > 0));  // current IE10
}
if (isTouchDevice()) {
  $('html').addClass('touch');
}




//-----------------------------------------------------------------------------
// OS DETECTION
//-----------------------------------------------------------------------------
// Code from https://gist.github.com/hkulekci/3433850
var OSName="unknownOS"; // failure to detect OS
if (navigator.appVersion.indexOf("Win")!=-1) OSName="windows";
if (navigator.appVersion.indexOf("Mac")!=-1) OSName="mac";
if (navigator.appVersion.indexOf("X11")!=-1) OSName="unix";
if (navigator.appVersion.indexOf("Linux")!=-1) OSName="linux";
$('html').addClass(OSName);
