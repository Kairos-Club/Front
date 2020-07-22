
// Hand Clock
// - - - - - - - - - - - - - - - - - - - - - - - -
class HandClock extends HTMLElement {
	constructor() {
		super();

		// Create shadow DOM and clock elements
		const shadow = this.attachShadow({mode: 'open'});
		const clockFace = document.createElement('div');
		const hourHand = document.createElement('div');
		const minuteHand = document.createElement('div');
		const secondHand = document.createElement('div');
		const style = document.createElement('style');
		const size = this.getAttribute('size');

		clockFace.setAttribute('class', 'clock-face');
		hourHand.setAttribute('class', 'hour hand');
		minuteHand.setAttribute('class', 'minute hand');
		secondHand.setAttribute('class', 'second hand');

		/*
          Display clock face using flex to easily center hands.
          Stack hands using absolute and rotate them all to an upright position.
          Use ::after element selector on each hand to create their visual components.
          This allows the base element to be the center of rotation.
          Specify a height and width for all hands based on size attribute.
        */
		style.textContent = `
      * {
        box-sizing: border-box;
      }
      .clock-face {
        align-items: center;
        justify-content: center;
        border: 2px solid black;
        border-radius: 50%;
        display: flex;
        background-color: black;
        height: ${size}px;
        width: ${size}px;
      }
      .hand::after {
        border-radius: 100px;
      }
      
      .hand {
        position: absolute;
        transform: rotate(-90deg);
      }
      .hand::after {
        background: white;
        content: '';
        margin-left: ${size / 50}px;
        position: absolute;
      }
      .hour::after {
        height: ${size < 200 ? 3 : 6}px;
        margin-top: -${size < 200 ? 2 : 3}px;
        width: ${size / 4}px;
      }
      .minute::after {
        height: ${size < 200 ? 2 : 4}px;
        margin-top: -${size < 200 ? 1 : 2}px;
        width: ${size / 2.7}px;
      }
      .second::after {
      background: red;
        height: ${size < 200 ? 1 : 2}px;
        margin-top: -1px;
        width: ${size / 2.4}px;
      }
    `

		// Fill shadow DOM
		shadow.appendChild(style);
		shadow.appendChild(clockFace);
		clockFace.appendChild(hourHand);
		clockFace.appendChild(minuteHand);
		clockFace.appendChild(secondHand);

		// Use Date object to find current time
		const renderClockHands = () => {
			const time = new Date();
			let hours = null;
			let minutes = null;
			let seconds = null;

			// If UTC is set then adjust time appropriately
			if (this.hasAttribute('utc')) {
				const utc = this.getAttribute('utc');
				hours = time.getUTCHours() + parseInt(utc);
				minutes = time.getUTCMinutes();
				seconds = time.getUTCSeconds();
			} else {
				hours = time.getHours();
				minutes = time.getMinutes();
				seconds = time.getSeconds();
			}

			// Calculate rotations based on time
			const hourRotation = (hours / 12) * 360 + (minutes / 60) * 30 - 90;
			const minuteRotation = (minutes / 60) * 360 + (seconds / 60) * 6 - 90;
			const secondRotation = (seconds / 60) * 360 - 90;

			// Set rotation of DOM elements
			hourHand.style.transform = `rotate(${hourRotation}deg)`;
			minuteHand.style.transform = `rotate(${minuteRotation}deg)`;
			secondHand.style.transform = `rotate(${secondRotation}deg)`;
		}

		// Update time every second
		setInterval(renderClockHands, 1000);
		renderClockHands(this);
	}
}

// Register DOM element
customElements.define('hand-clock', HandClock);


// PJaxRouter
// - - - - - - - - - - - - - - - - - - - - - - - -

/*
var router = new PJaxRouter({
	container: document.getElementById("content"), // container where datas will be striped/appended
	cancelNavigationClass: "out", // links with that class does not trigger PJAX navigation
	cacheLinks: ".important-pages", // cache pages for all the links that have the ".important-pages" class on init and after each successful navigation
	cacheNavigatedPages: true, // add the current page to the cache after each successful navigation
	cacheLength: 15, // set the cache size to 15 entries

	onStart: {
		value: function(currentPage, nextPage) {
			console.log("anm-content-out");

			$('body').removeClass('anm-content-in').addClass('anm-content-out');
		},
	},
	onLeaving: {
		duration: 150,
		value: function(currentPage, nextPage) {
			console.log("anm-content-waiting");
		},
	},
	onWaiting: {
		value: function(currentPage, nextPage) {
			console.log("anm-content-loading");

			$('body').removeClass('anm-content-out').addClass('anm-content-loading');
		},
	},
	onError: {
		value: function(currentPage, nextPage) {
			console.log("anm-content-error");
			$('body').removeClass('anm-content-out').removeClass('anm-content-loading').addClass('anm-content-error');
		},
	},
	onReady: {
		value: function(prevPage, currentPage) {
			console.log("anm-content-in");
			$('body').removeClass('anm-content-out').removeClass('anm-content-loading').addClass('anm-content-in');
		},
	},
});
*/




// FancyBox V3
// - - - - - - - - - - - - - - - - - - - - - - - -


$('[data-fancybox]').fancybox({

	// Close existing modals
	// Set this to false if you do not need to stack multiple instances
	closeExisting: false,

	// Enable infinite gallery navigation
	loop: false,

	// Horizontal space between slides
	gutter: 0,

	// Enable keyboard navigation
	keyboard: true,

	// Should allow caption to overlap the content
	preventCaptionOverlap: true,

	// Should display navigation arrows at the screen edges
	arrows: true,

	// Should display counter at the top left corner
	infobar: false,

	// Should display close button (using `btnTpl.smallBtn` template) over the content
	// Can be true, false, "auto"
	// If "auto" - will be automatically enabled for "html", "inline" or "ajax" items
	smallBtn: "auto",

	// Should display toolbar (buttons at the top)
	// Can be true, false, "auto"
	// If "auto" - will be automatically hidden if "smallBtn" is enabled
	toolbar: "auto",

	// What buttons should appear in the top right corner.
	// Buttons will be created using templates from `btnTpl` option
	// and they will be placed into toolbar (class="fancybox-toolbar"` element)
	buttons: [
		//"zoom",
		//"share",
		//"slideShow",
		//"fullScreen",
		//"download",
		//"thumbs",
		"close"
	],

	// Detect "idle" time in seconds
	idleTime: 3,

	// Disable right-click and use simple image protection for images
	protect: false,

	// Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
	modal: false,

	image: {
		// Wait for images to load before displaying
		//   true  - wait for image to load and then display;
		//   false - display thumbnail and load the full-sized image over top,
		//           requires predefined image dimensions (`data-width` and `data-height` attributes)
		preload: false
	},

	ajax: {
		// Object containing settings for ajax request
		settings: {
			// This helps to indicate that request comes from the modal
			// Feel free to change naming
			data: {
				fancybox: true
			}
		}
	},

	iframe: {
		// Iframe template
		tpl:
			'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen allow="autoplay; fullscreen" src=""></iframe>',

		// Preload iframe before displaying it
		// This allows to calculate iframe content width and height
		// (note: Due to "Same Origin Policy", you can't get cross domain data).
		preload: true,

		// Custom CSS styling for iframe wrapping element
		// You can use this to set custom iframe dimensions
		css: {},

		// Iframe tag attributes
		attr: {
			scrolling: "auto"
		}
	},

	// For HTML5 video only
	video: {
		tpl:
			'<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}">' +
			'<source src="{{src}}" type="{{format}}" />' +
			'Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!' +
			"</video>",
		format: "", // custom video format
		autoStart: true
	},

	// Default content type if cannot be detected automatically
	defaultType: "image",

	// Open/close animation type
	// Possible values:
	//   false            - disable
	//   "zoom"           - zoom images from/to thumbnail
	//   "fade"
	//   "zoom-in-out"
	//
	animationEffect: "fade",

	// Duration in ms for open/close animation
	animationDuration: 300,

	// Should image change opacity while zooming
	// If opacity is "auto", then opacity will be changed if image and thumbnail have different aspect ratios
	zoomOpacity: "false",

	// Transition effect between slides
	//
	// Possible values:
	//   false            - disable
	//   "fade'
	//   "slide'
	//   "circular'
	//   "tube'
	//   "zoom-in-out'
	//   "rotate'
	//
	transitionEffect: "fade",

	// Duration in ms for transition animation
	transitionDuration: 300,

	// Custom CSS class for slide element
	slideClass: "",

	// Custom CSS class for layout
	baseClass: "",

	// Base template for layout
	baseTpl:
		'<div class="fancybox-container" role="dialog" tabindex="-1">' +
		'<div class="fancybox-bg"></div>' +
		'<div class="fancybox-inner">' +
		'<div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div>' +
		'<div class="fancybox-toolbar">{{buttons}}</div>' +
		'<div class="fancybox-navigation">{{arrows}}</div>' +
		'<div class="fancybox-stage"></div>' +
		'<div class="fancybox-caption"><div class=""fancybox-caption__body"></div></div>' +
		'</div>' +
		'</div>',

	// Loading indicator template
	spinnerTpl: '<div class="fancybox-loading"></div>',

	// Error message template
	errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',

	btnTpl: {
		download:
			'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' +
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg>' +
			"</a>",

		zoom:
			'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' +
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg>' +
			"</button>",

		close:
			'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
			'<i class="fas fa-times"></i>' +
			"</button>",

		// Arrows
		arrowLeft:
			'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
			'<div><i class="fas fa-arrow-left"></i></div>' +
			"</button>",

		arrowRight:
			'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
			'<div><i class="fas fa-arrow-right"></i></div>' +
			"</button>",

		// This small close button will be appended to your html/inline/ajax content by default,
		// if "smallBtn" option is not set to false
		smallBtn:
			'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}">' +
			'&times;' +
			"</button>"
	},

	// Container is injected into this element
	parentEl: "body",

	// Hide browser vertical scrollbars; use at your own risk
	hideScrollbar: true,

	// Focus handling
	// ==============

	// Try to focus on the first focusable element after opening
	autoFocus: true,

	// Put focus back to active element after closing
	backFocus: true,

	// Do not let user to focus on element outside modal content
	trapFocus: true,

	// Module specific options
	// =======================

	fullScreen: {
		autoStart: false
	},

	// Set `touch: false` to disable panning/swiping
	touch: {
		vertical: true, // Allow to drag content vertically
		momentum: true // Continue movement after releasing mouse/touch when panning
	},

	// Hash value when initializing manually,
	// set `false` to disable hash change
	hash: null,

	// Customize or add new media types
	// Example:
	/*
      media : {
        youtube : {
          params : {
            autoplay : 0
          }
        }
      }
    */
	media: {},

	slideShow: {
		autoStart: false,
		speed: 3000
	},

	thumbs: {
		autoStart: false, // Display thumbnails on opening
		hideOnClose: true, // Hide thumbnail grid when closing animation starts
		parentEl: ".fancybox-container", // Container is injected into this element
		axis: "y" // Vertical (y) or horizontal (x) scrolling
	},

	// Use mousewheel to navigate gallery
	// If 'auto' - enabled for images only
	wheel: "auto",

	// Callbacks
	//==========

	// See Documentation/API/Events for more information
	// Example:
	/*
      afterShow: function( instance, current ) {
        console.info( 'Clicked element:' );
        console.info( current.opts.$orig );
      }
    */

	onInit: $.noop, // When instance has been initialized

	beforeLoad: $.noop, // Before the content of a slide is being loaded
	afterLoad: $.noop, // When the content of a slide is done loading

	beforeShow: $.noop, // Before open animation starts
	afterShow: $.noop, // When content is done loading and animating

	beforeClose: $.noop, // Before the instance attempts to close. Return false to cancel the close.
	afterClose: $.noop, // After instance has been closed

	onActivate: $.noop, // When instance is brought to front
	onDeactivate: $.noop, // When other instance has been activated

	// Interaction
	// ===========

	// Use options below to customize taken action when user clicks or double clicks on the fancyBox area,
	// each option can be string or method that returns value.
	//
	// Possible values:
	//   "close"           - close instance
	//   "next"            - move to next gallery item
	//   "nextOrClose"     - move to next gallery item or close if gallery has only one item
	//   "toggleControls"  - show/hide controls
	//   "zoom"            - zoom image (if loaded)
	//   false             - do nothing

	// Clicked on the content
	clickContent: function(current, event) {
		return current.type === "image" ? "zoom" : false;
	},

	// Clicked on the slide
	clickSlide: "close",

	// Clicked on the background (backdrop) element;
	// if you have not changed the layout, then most likely you need to use `clickSlide` option
	clickOutside: "close",

	// Same as previous two, but for double click
	dblclickContent: false,
	dblclickSlide: false,
	dblclickOutside: false,

	// Custom options when mobile device is detected
	// =============================================

	mobile: {
		preventCaptionOverlap: false,
		idleTime: false,
		clickContent: function(current, event) {
			return current.type === "image" ? "toggleControls" : false;
		},
		clickSlide: function(current, event) {
			return current.type === "image" ? "toggleControls" : "close";
		},
		dblclickContent: function(current, event) {
			return current.type === "image" ? "zoom" : false;
		},
		dblclickSlide: function(current, event) {
			return current.type === "image" ? "zoom" : false;
		}
	}
});



// Console
// - - - - - - - - - - - - - - - - - - - - - - - -
console.log("%cᕦ(ò_ó*)ᕤ\na website by Muraker\nwww.muraker.com", "font-size:15px");

