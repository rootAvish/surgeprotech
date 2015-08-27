$('#header').onePageNav({
    currentClass: 'current',
    changeHash: true,
    scrollSpeed: 200,
    scrollThreshold: 0.5,
    filter: '',
    easing: 'linear'
});

var sticky = new Waypoint.Sticky({
  element: $('.back-to-top')
});

$('.animated').appear(function(){
     var element = $(this);
     var animation = element.data('animation');
     var animationDelay = element.data('delay');
     if (animationDelay) {
       setTimeout(function(){
         element.addClass( animation + " visible" );
         element.removeClass('hiding');
         if (element.hasClass('counter')) {
           element.find('.value').countTo();
         }
       }, animationDelay);
     }else {
       element.addClass( animation + " visible" );
       element.removeClass('hiding');
       if (element.hasClass('counter')) {
         element.find('.value').countTo();
       }
     }    
   },{accY: -150});

var listfull = false;

$('#member-list-toggle').click(function(event) {

    if (listfull == false) {
        $('#member-list-toggle').html('SEE LESS<i class="fa fa-arrow-up"></i>');
        listfull = true;
    }
    else {
        $('#member-list-toggle').html('SEE ALL<i class="fa fa-arrow-down"></i>');
        listfull = false;
    }
});

$(document).ready(function() {
    var offset=250, // At what pixels show Back to Top Button
    scrollDuration=300; // Duration of scrolling to top
        $(window).scroll(function() {
        if ($(this).scrollTop() > offset) {
                $('.back-to-top').fadeIn(500); // Time(in Milliseconds) of appearing of the Button when scrolling down.
                } else {
        $('.back-to-top').fadeOut(500); // Time(in Milliseconds) of disappearing of Button when scrolling up.
        }
    });

    // Smooth animation when scrolling
    $('.back-to-top').click(function(event) {
    event.preventDefault();
            $('html, body').animate({
            scrollTop: 0}, scrollDuration);
                })
    });