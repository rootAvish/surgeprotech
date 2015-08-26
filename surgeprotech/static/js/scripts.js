$('#header').onePageNav({
    currentClass: 'current',
    changeHash: true,
    scrollSpeed: 200,
    scrollThreshold: 0.5,
    filter: '',
    easing: 'linear'
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