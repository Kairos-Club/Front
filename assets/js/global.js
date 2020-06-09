/**
 * Created by Partikule on 11/05/2017.
 */
var Global = {

	domain: window.location.protocol + '//' + window.location.hostname,

	initGlobal: function()
	{
		var element = $.type(arguments[0]) != 'undefined' ? arguments[0] : $('.global-ajax-link'),
			options = $.type(arguments[1]) != 'undefined' ? arguments[1] : {},
			opt = {
				type: 'ajax',
				settings: {
					cache: false
				},
				mainClass: 'global-ajax-view',
				showCloseBtn: true,
				closeOnContentClick: false,
				closeOnBgClick: true,
				fixedContentPos: true,
				removalDelay: 200,
				closeBtnInside: true,
				callbacks: {
					ajaxContentAdded: function() {
						// Load Sticky-Kit in the POPUP
						var parentWin = $(this.content).parent();
						$('.sticky_element').stick_in_parent({
							offset_top: null,
							parentWin: parentWin
						});
					}
				}
			}
		;

		$(element).magnificPopup(opt);
	},

// &#xe802;
	initGlobalInCartPanel: function()
	{
		var self = this,
			options = $.type(arguments[0]) != 'undefined' ? arguments[0] : {}
		;

		$('.global-ajax-link', $('.panel-quick-view ')).click(function(evt)
		{
			evt.preventDefault();

			var href = $(this).attr('href');

			$.ajax(
				self.domain + '/' + Lang.current + '/' + $(this).attr('href'),
				{
					success: function(html)
					{
						$('.mfp-content').html(html);

						// Title
						var title = $('.main.article', $('.mfp-content')),
							title_str = title.text(),
							panelTop = $('<div class="panel-top">').html(title_str),
						//	panelTopIcon = $('<i class="icon-bigwax icon-cart">&#xe805;</i>'),
							panelContent = $('<div class="panel-content"/>'),
							panelBottomFeed = $('<div class="panel-bottom-feed"/>'),
							panelBottom = $('<div class="panel-bottom"/>')
						;

						// Add the icon to the PanelTop
						// panelTop.prepend(panelTopIcon);

						title.remove();

						panelContent.html($('.mfp-content').html());

						$('.mfp-content').empty().append(panelTop, panelContent, panelBottomFeed, panelBottom);

						$.magnificPopup.instance.content = $('.mfp-content');

						if (options.onBack)
						{
							var btnBack = $('<button title="Close (Esc)" type="button" class="mfp-back"></button>');
							var btnBackBottom = $('<a class="button-hard">' + options.onBackLabel + '</a>');

							btnBack.click(function(){
								options.onBack();
							});

							btnBackBottom.click(function(){
								options.onBack();
							});

							$('.mfp-content').append(btnBack);
							panelBottom.append(btnBackBottom);
						}
					}
				}
			);
		});
	},




	getContent: function(item)
	{
		$(item).click(function(e)
		{
			self = this;
			e.preventDefault();

			$('#globalLauncher').hide();


			var domain =  window.location.protocol + '//' + window.location.hostname;

			$.ajax(
				domain + '/' + Lang.current + '/panel/display/page/' + $(this).attr('data-href'),
				{
					success: function(html)
					{
						$('#globalContent').html(html);
						$('#globalContent').show();
						$('.mfp-content').animate({scrollTop:0}, 'fast');
						console.log(domain + '/' + Lang.current + '/panel/display/page/' + $(self).attr('data-href'))

					},
					// Receives
					error: function(xhr, status, error)
					{
					}
				}
			);


		});
	},

/*
	getTermCondition: function(e)
	{
		self = this;
		e.preventDefault();

		$('#globalLauncher').hide();

		var domain =  window.location.protocol + '//' + window.location.hostname;

		$.ajax(
			domain + '/' + Lang.current + '/panel/display/page/global/terms-conditions',
			{
				success: function(html)
				{
					$('#globalContent').html(html);
					$('#globalContent').show();
					console.log(domain + '/' + Lang.current + '/panel/display/page/' + $(self).attr('data-href'))

				},
				// Receives
				error: function(xhr, status, error)
				{
				}
			}
		);
	},
*/

	getGlobalSections: function () {
		$('#globalContent').hide();
		$('#globalLauncher').show();
	}

};