(function($) {
    "use strict";

    // Page scrolling
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight top nav when scrolling
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });

    // Closes menu when click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for main nav
    $('#mainNav').affix({
        offset: {
            top: 50
        }
    });
    
    $('#lostPasswordBtn').click(function() {
    	window.location.href = CONTEXT_PATH + "/resetpassword/request";
    });
})(jQuery);