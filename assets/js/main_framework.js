
// Textarea auto resize
// - - - - - - - - - - - - - - - - - - - - - - - -
jQuery.each(jQuery('textarea[data-autoresize]'), function() {
    var offset = this.offsetHeight - this.clientHeight;
    var resizeTextarea = function(el) {
        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
    };
    jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
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
                }, 500);
                return false;
            }
        }
    });
});


// Flickity
// - - - - - - - - - - - - - - - - - - - - - - - -
var flkty = new Flickity( '.bw-carousel-1', {
    cellAlign: 'center',
    freeScroll: false,
    groupCells: '85%',
    pageDots: false,
    adaptiveHeight: false,
    selectedAttraction: 0.3,
    friction: 1
});
var flkty = new Flickity( '.bw-carousel-2', {
    cellAlign: 'center',
    freeScroll: false,
    groupCells: '85%',
    pageDots: false,
    adaptiveHeight: false,
    selectedAttraction: 0.3,
    friction: 1
});
var flkty = new Flickity( '.bw-carousel-3', {
    cellAlign: 'center',
    freeScroll: false,
    groupCells: '85%',
    selectedAttraction: 0.3,
    friction: 1
});


// Sticky-Kit
// - - - - - - - - - - - - - - - - - - - - - - - -
$(".sticky_column").stick_in_parent({
    offset_top: 120,
    parent: ".sticky_container"
});
$(".sticky_column").attr('data-sticky', 'sticked');

$('.sticky_element').stick_in_parent({
    offset_top: null
});



$(window).resize(function(){

    console.log('resize !!!');

    if(window.matchMedia('(max-width: 1000px)').matches)
    {
        $(".sticky_column").trigger("sticky_kit:detach");
        $(".sticky_column").attr('data-sticky', 'detached');
    }

    if(window.matchMedia('(min-width: 1000px)').matches) {
        console.log('min-width:1000');

        if ($(".sticky_column").attr('data-sticky') == 'detached')
        {
            $(".sticky_column").stick_in_parent({
                offset_top: 120,
                parent: ".sticky_container"
            });
            $(".sticky_column").attr('data-sticky', 'sticked');
        }


        // $(".sticky_column").trigger("sticky_kit:recalc");
    }

});


// Magnific Popup
// - - - - - - - - - - - - - - - - - - - - - - - -

// Translating
$.extend(true, $.magnificPopup.defaults, {
    tClose: 'Close (Esc)', // Alt text on close button
    tLoading: 'Loading...', // Text that is displayed during loading. Can contain %curr% and %total% keys
    gallery: {
        tPrev: 'Previous (Left arrow key)', // Alt text on left arrow
        tNext: 'Next (Right arrow key)', // Alt text on right arrow
        tCounter: '%curr% of %total%' // Markup for "1 of 7" counter
    },
    image: {
        tError: 'Content could not be loaded <span>&#128531;</span>' // Error message when image could not be loaded
    },
    ajax: {
        tError: 'Content could not be loaded <span>&#128531;</span>' // Error message when ajax request failed
    }
});

// Panel Link
$('.panel-ajax-link').magnificPopup({

    type: 'ajax',
    settings: {
        cache:false,
        async:false
    },

    mainClass: 'panel-quick-view',
    showCloseBtn: true,
    closeOnContentClick: false,
    closeOnBgClick: true,

    fixedContentPos: true,

    //overflowY: 'scroll',

    //removalDelay: 0,
    removalDelay: 200,

    closeBtnInside: true,
    //closeMarkup: '<button title="%title%" type="button" class="button button-light panel-button-close"><i class="icon-bigwax icon-close">&#xe806;</i></button>',

    callbacks: {
        ajaxContentAdded: function() {
            // Load Sticky-Kit in the POPUP
            var parentWin = $(this.content).parent();
            $('.sticky_element').stick_in_parent({
                offset_top: null,
                parentWin: parentWin
            });
        },

        parseAjax: function(mfpResponse) {
            console.log('Ajax content loaded:', mfpResponse);
        }
    }
});

// Global Link
$('.global-ajax-link').magnificPopup({

    type: 'ajax',
    settings: {
        cache:false,
        async:false
    },

    mainClass: 'global-ajax-view',
    showCloseBtn: true,
    closeOnContentClick: false,
    closeOnBgClick: true,

    fixedContentPos: true,

    //overflowY: 'scroll',

    //removalDelay: 0,
    removalDelay: 200,

    closeBtnInside: true,
    //closeMarkup: '<button title="%title%" type="button" class="button button-light panel-button-close"><i class="icon-bigwax icon-close">&#xe806;</i></button>',

    callbacks: {
        ajaxContentAdded: function() {
            // Load Sticky-Kit in the POPUP
            var parentWin = $(this.content).parent();
            $('.sticky_element').stick_in_parent({
                offset_top: null,
                parentWin: parentWin
            });
        },

        parseAjax: function(mfpResponse) {
            console.log('Ajax content loaded:', mfpResponse);
        }
    }
});


// Photoswipe
// - - - - - - - - - - - - - - - - - - - - - - - -
var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i];
            if(figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0];
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if(figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }
            if(linkEl.children.length > 0) {
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl;
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };
    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if(!clickedListItem) {
            return;
        }
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) {
                continue;
            }
            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };
    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};
        if(hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if(pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        // define options (if needed)
        options = {

            hideAnimationDuration:100,
            showAnimationDuration:200,
            //spacing: 0,
            showHideOpacity: true,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();
                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }
        };
        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }
        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }
        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );
    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};
// execute above function
initPhotoSwipeFromDOM('.bw-gallery');


// Replace all .img (with .svg class) by inline SVG
// - - - - - - - - - - - - - - - - - - - - - - - -
jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');
    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');
        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }
        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');
        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }
        // Replace image with new SVG
        $img.replaceWith($svg);
    }, 'xml');
});


// Simple Text Rotator
// https://github.com/peachananr/simple-text-rotator
// - - - - - - - - - - - - - - - - - - - - - - - -
$(".rotate").textrotator();


// Fade out on scroll
// - - - - - - - - - - - - - - - - - - - - - - - -
$(window).scroll(function(){
    //$(".header-fix").css("opacity", $(window).scrollTop() / 24);
    $(".menu-logo-bigwax").css("opacity", 1 - $(window).scrollTop() / 96);
    $(".menu-logo-brand").css("opacity", $(window).scrollTop() / 96).toggle($(this).scrollTop()>2);
    $(".down-indicator").css("opacity", 1 - $(window).scrollTop() / 96).toggle($(this).scrollTop()<96);
    //$(".brand-home").css("opacity", 1 - $(window).scrollTop() / 96);
});


// Toggle visibility off submenu Search and Filter
// - - - - - - - - - - - - - - - - - - - - - - - -
function toggle_visibility(id) {
    var e = document.getElementById(id);
    if(e.style.height == '96px')
        e.style.height = '0';
    else
        e.style.height = '96px';
}


// Readmore
// - - - - - - - - - - - - - - - - - - - - - - - -
$('.readmore').readmore({
    selector: '.readmore',
    moreLink: '<a class="readmore-button"><i class="material-icons">&#xE147;</i> Order detail</a>',
    lessLink: '<a class="readmore-button"><i class="material-icons">&#xE15C;</i> Order detail</a>',
    collapsedHeight: 0,
    heightMargin: 0,
    embedCSS: false,
    speed: 200
});


// Toggle menu link
// JUSTE FOR SIMULATION, DELETE IN PRODUCTION
// - - - - - - - - - - - - - - - - - - - - - - - -
$( ".menu a, .submenu a" ).click(function() {
    $( this ).toggleClass( "active" );
});


// Relax (parallax scroll)
// Code méga pouris a revoir completement !!!!!!!!!!!!!!!!!
// - - - - - - - - - - - - - - - - - - - - - - - -

if ( $(window).width() > 1024) {
    var rellax = new Rellax('.rellax', {
        center: true
    });
}
else {
}


$(document).ready(function(){
    $(window).on('resize',function(){

        if ($(window).width() > 1024) {

            location.reload();  // refresh page

        }
        else {

        }
    });
});
