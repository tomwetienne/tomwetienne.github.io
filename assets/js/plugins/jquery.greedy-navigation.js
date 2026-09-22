/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $hlinks = $('#site-nav .hidden-links');

var breaks = [];

// At or below this width every link lives in the dropdown, so the top bar
// shows the site title and the menu button only. Matches $medium in
// _variables.scss. Above it the original greedy behaviour applies: links
// stay visible until they no longer fit.
var MOBILE_BREAKPOINT = 768;
var forcedCollapse = false;

// Move every link into the dropdown at once, keeping their order.
function collapseAllLinks() {
  var $items = $vlinks.children('*:not(.masthead__menu-item--lg)');

  if ($items.length) {
    $hlinks.prepend($items);
  }

  breaks = [];
  forcedCollapse = true;
  $btn.removeClass('hidden');
}

// Hand the links back to the top bar so the greedy measuring can run again.
function restoreAllLinks() {
  $vlinks.append($hlinks.children());

  breaks = [];
  forcedCollapse = false;
  $hlinks.addClass('hidden');
  $btn.addClass('hidden').removeClass('close');
}

function updateNav() {

  if ($(window).width() <= MOBILE_BREAKPOINT) {
    if (!forcedCollapse) {
      collapseAllLinks();
    }
    $btn.attr("count", $hlinks.children().length);
    return;
  }

  if (forcedCollapse) {
    restoreAllLinks();
  }

  var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

  // The visible list is overflowing the nav
  if($vlinks.width() > availableSpace) {

    // Record the width of the list
    breaks.push($vlinks.width());

    // Move item to the hidden list
    $vlinks.children('*:not(.masthead__menu-item--lg)').last().prependTo($hlinks);

    // Show the dropdown btn
    if($btn.hasClass('hidden')) {
      $btn.removeClass('hidden');
    }

  // The visible list is not overflowing
  } else {

    // There is space for another item in the nav
    if(availableSpace > breaks[breaks.length-1]) {

      // Move the item to the visible list
      $hlinks.children().first().appendTo($vlinks);
      breaks.pop();
    }

    // Hide the dropdown btn if hidden list is empty
    if(breaks.length < 1) {
      $btn.addClass('hidden');
      $hlinks.addClass('hidden');
    }
  }

  // Keep counter updated
  $btn.attr("count", breaks.length);

  // Recur if the visible list is still overflowing the nav
  if($vlinks.width() > availableSpace) {
    updateNav();
  }

}

// Window listeners

$(window).resize(function() {
  updateNav();
});

$btn.on('click', function() {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
});

updateNav();