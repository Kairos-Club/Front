
var Panel = {

	init: function()
	{

	},

	/**
	 * @param	null | DomElement ID
	 * @param	options object {
	 * 						post: {
	 * 							var: value
	 *						}
	 * 					}
	 *
	 */
	initPanels: function()
	{
		var element = $.type(arguments[0]) != 'undefined' ? arguments[0] : $('.panel-ajax-link'),
			options = $.type(arguments[1]) != 'undefined' ? arguments[1] : {},
			opt = {
				type: 'ajax',
				settings: {
					cache: false
				},
				mainClass: 'panel-quick-view',
				showCloseBtn: true,
				midClick: true,
				closeOnContentClick: false,
				closeOnBgClick: true,
				fixedContentPos: true,
				removalDelay: 200,
				closeBtnInside: true,
				callbacks: {
					change: function()
					{
					},
					ajaxContentAdded: function()
					{
						// Load Sticky-Kit in the POPUP
						var parentWin = $(this.content).parent();
						$('.sticky_element').stick_in_parent({
							offset_top: null,
							parentWin: parentWin
						});
					},
					close: function()
					{
						soundManager.reboot();
					},
					parseAjax: function(jqXHR)
					{
					},
					beforeAppend: function()
					{

						this.contentContainer.empty();
					}
				}
			}
		;

		if (options.cookie)
		{
			Cookies.set(options.cookie.name, options.cookie.value);
		}

		if (options.post)
		{
			$.magnificPopup.instance.st.ajax.settings = {
				data: options.post
			};
		}

		$(element).magnificPopup(opt);


		/*
		$(element).on('click', function (e) {
			e.preventDefault();

			const instance = $.magnificPopup.instance;

			instance.open({
				callbacks: {
					beforeAppend() {
						if (!instance.waitingForAjax) {
							instance.content = [$('<div/>')];
						}

						instance.waitingForAjax = false;
					},
					parseAjax(response) {
						instance.currTemplate = {'ajax': true};
						instance.waitingForAjax = true;
					},
				},
				items: {
					src: $(this).attr('href'),
					type: 'ajax'
				}
			});

			instance.ev.off('mfpBeforeChange.ajax');
		});
		*/
	}
};