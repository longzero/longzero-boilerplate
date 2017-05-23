// DEBUG
if(!window.console) {console={}; console.log = function(){};}


// BREAKPOINTS
var breakpointMobile = 480;
var breakpointTablet = 600;
var breakpointIpad = 768;
var breakpointDesktop = 960;
var breakpointIpadLandscape = 1024;
var breakpointLarge = 1200;
var breakpointAir = 1400;

var breakpointHeader = 960;


// WINDOW WIDTH AND HEIGHT
var windowWidth = $(window).width();
var windowHeight = $(window).height();
$(window).resize(function(){
  windowWidth = $(window).width();
  windowHeight = $(window).height();
});


// GENERAL VARIABLES
var marginMobile = 15;
var siteWidth = 1010;


// $('form').parsley();


// ==========================================================================
// HAMBURGER
// ==========================================================================
$(function(){
  $('.show-me-more,.js-main-nav-link').click(function() {
    $(this).toggleClass('active');
    $('.js-main-navigation').toggleClass('show-navigation');
  });

  if ($('.wow').length) new WOW().init();
});


$(window).on('resize', function() {
  if ($(this).width() >= breakpointHeader) {
    if (!$('.js-main-navigation').hasClass('show-navigation'))
      $('.js-main-navigation').addClass('show-navigation');
  }
  else {
    $('.js-main-navigation').removeClass('show-navigation');
    $('.show-me-more').removeClass('active');
  }
});


;(function($){

  /**
   * jQuery function to prevent default anchor event and take the href * and the title to make a share popup
   *
   * @param  {[object]} e           [Mouse event]
   * @param  {[integer]} intWidth   [Popup width defalut 500]
   * @param  {[integer]} intHeight  [Popup height defalut 400]
   * @param  {[boolean]} blnResize  [Is popup resizeabel default true]
   */
  $.fn.customerPopup = function (e, intWidth, intHeight, blnResize) {

    // Prevent default anchor event
    e.preventDefault();

    // Set values for window
    intWidth = intWidth || '500';
    intHeight = intHeight || '400';
    strResize = (blnResize ? 'yes' : 'no');

    // Set title and open popup with focus on it
    var strTitle = ((typeof this.attr('title') !== 'undefined') ? this.attr('title') : 'Social Share'),
        strParam = 'width=' + intWidth + ',height=' + intHeight + ',resizable=' + strResize,
        objWindow = window.open(this.attr('href'), strTitle, strParam).focus();
  }

  /* ================================================== */

  $(document).ready(function ($) {
    $('.js-share').on("click", function(e) {
      $(this).customerPopup(e);
    });
  });

}(jQuery));
