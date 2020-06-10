
// Medium Zoom
// - - - - - - - - - - - - - - - - - - - - - - - -
mediumZoom('.zoomable', {
	margin: 10,
	background: 'transparent',
	scrollOffset: 0
});

// Smooth Scroll
// - - - - - - - - - - - - - - - - - - - - - - - -
$(function() {
	$('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 300);
				return false;
			}
		}
	});
});

// Console
// - - - - - - - - - - - - - - - - - - - - - - - -
console.log("%cᕦ(ò_ó*)ᕤ\na website by Muraker\nwww.muraker.com", "font-size:15px");