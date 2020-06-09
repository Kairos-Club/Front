/**
 * Shop object
 *
 */
var Shop = {

	domain: window.location.protocol + '//' + window.location.hostname,

	data: {},

	settings: {

		currency: {
			current: {
				code: '€'
			}
		},

		formValidator:
			{
			validClass: 'success',

			errorClass: 'form-message-input error',

			errorPlacement: function(error, element)
			{
			//	element.before(error);
			},
			invalidHandler: function(form, validator) {

				if (!validator.numberOfInvalids())
					return;

				var label = $(validator.errorList[0].element).prev('label');

				if (label.length > 0 && label.attr('id'))
					window.location.hash = '#' + $(label).attr('id');
				else
					window.location.hash = '#' + $(validator.errorList[0].element).attr('id');
			}
		}
	},


	initProductButtons: function()
	{
		var self = this,
			selects = $('.selectProductOption');

		if (selects.length > 0)
		{
			$.each(selects, function(idx, select)
			{
				$(select).change(function()
				{
					var selected = $('option:selected', $(this)).first(),
						medias = Tools.decodeBase64(selected.attr('data-medias')),
						id_selector =  $(select).attr('data-id-selector'),
						data = selected.data()
					;

					data['id_product'] = selected.val();

					medias = $.parseJSON(medias);

					$('.bw-gallery').empty();

					$.each(medias, function(src, val)
					{
						if (val.type == 'picture')
						{
							var img = $('<img src="'+ val['src_small'] +'"/>'),
								figure = $('<figure class="aImg" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject"/>'),
								a = $('<a  href="'+ val['src_big'] +'" itemprop="contentUrl" data-size="'+ val['width'] +' x '+val['height'] +'" >');

							$('.bw-gallery').append(figure);
							figure.append(a);
							a.html(img);
						}
					});

					self.buildAddToCartButton(data, id_selector);
				});

				$(select).change();
			});
		}

		var inputs = $('.inputProductOption');

		if (inputs.length > 0)
		{
			$.each(inputs, function(idx, input)
			{
				var id_selector = $(input).attr('data-id-selector'),
					data = $(input).data();

				data['id_product'] = $(input).attr('data-id-product');

				self.buildAddToCartButton(data, id_selector);

			});
		}
	},


	initWishlistButtons: function(options)
	{
		var self = this,
			inputs = $('.inputWishListProductOption');

		if (inputs.length > 0)
		{
			$.each(inputs, function(idx, input)
			{
				var id_selector = $(input).attr('data-id-selector'),
					data = $(input).data();

				data['id_product'] = $(input).attr('data-id-product');

				self.buildAddToCartButton(data, id_selector, options);
			});
		}
	},

	

	/**
	 *
	 * @param data			Object {
	 * 							medias: "W3sidHlwZSI6InBpY3R1cmUiLCJzcmNfc21…",
	 * 							context: "product", "wishlist",
	 * 							loggedIn: "",
	 * 							nbRequests: "",
	 * 							enableRequest: 0,
	 * 							preorderDate: "",
	 * 							inWishlist: "",
	 * 							inCart: "",
	 * 							inStock: 10,
	 * 							price: "50.00"
	 * 						}
	 *
	 * @param id_selector
	 *
	 */
	buildAddToCartButton: function(data, id_selector)
	{
		var self = this,

			options = $.type(arguments[2]) != 'undefined' ? arguments[2] : {},

			id_product = data.id_product,
			is_configurable = id_product != id_selector ? true : false,
			nb_requests = (data.nbRequests) == '' ? 0 : (data.nbRequests),
			msg_request = nb_requests > 1 ? Lang.get('product_article_requests') : Lang.get('product_article_request'),

			detailSelector = options.detailSelector ? options.detailSelector : '.product-details',
			actionSelector = options.actionSelector ? options.actionSelector : '.product-actions',

			detailCont = $(detailSelector + '[data-id-selector=' + id_selector + ']'),
			actionCont = $(actionSelector + '[data-id-selector=' + id_selector + ']'),

			// Details
			productPriceDiv = $('<div/>', {class:'productPrice'}).html(data.price + ' €'),
			productDateDiv = $('<div/>', {class:'productDate product-detail-date'}),
			productStockDiv = $('<div/>', {class:'productStock product-detail-stock'}).html(data.inStock + ' ex. (stock)'),
			productSoldOutDiv = $('<div/>', {class:'productSoldOut product-detail-stock-out'}).html(Lang.get('product_block_out_of_stock')),
			productRequestDiv = $('<div/>', {class:'product-detail-request productRequest'}),
			productRequestSpanNb = $('<span/>', {class:'productNbRequest', 'data-id-product':id_product}).html(nb_requests),
			productRequestSpanMsg = $('<span/>', {class:'productTextRequest', 'data-id-product':id_product}).html(' ' + msg_request),

			// Actions
			productActionDiv = $('<div/>', {class:'product-action-add-to-cart'}),
			productActionIcon = data.inCart == 1 ? $('<i/>', {class:'material-icons'}).html('&#xE876;') : null,
			productActionText = data.inCart == 1 ? Lang.get('cart_label_payment_button_added') : Lang.get('product_label_add_to_cart'),
			productActionButton = $('<a/>', {class:'btnAddToCart button', 'data-id-product': id_product}),

			productWishListButtonClass = data.context != 'wishlist' ? 'btnAddToWishList' : 'btnRemoveFromWishlist',
			productWishListDiv = $('<div/>', {class:'product-action-add-to-wish-list'}),
			productWishListButton = $('<a/>', {class:'button ' + productWishListButtonClass}),
			productWishListIcon = $('<i/>', {class:'icon-bigwax icon-favorite'}).html('&#xe80b;'),
			productWishListIconRemove = $('<i/>', {class:'icon-bigwax icon-close'}).html('&#xe806;'),

			now = new Date(),
			pre_date = data.preorderDate != '' ? new Date(Date.parse((data.preorderDate.substring(0, 10)).replace(/-/g,"/"))) : now,
			pre_date_str = pre_date.getDate()  + "/" + (pre_date.getMonth()+1) + "/" + pre_date.getFullYear(),

			add_price = true,
			add_date = false,
			add_stock = false,
			add_sold_out = false,
			add_request = false
		;

		if (is_configurable)
		{
			var select = $('.selectProductOption[data-id-selector='+id_selector+']').first(),
				selected = $('option:selected', $(select)).first();

			if (selected.val() != id_product)
				return;
		}

		detailCont.empty();
		actionCont.empty();

		if (data.inStock > 0)
		{
			if (productActionIcon != null) productActionButton.append(productActionIcon);

			// WishList
			if (data.context != 'wishlist')
			{
				if (data.inWishlist) productWishListButton.addClass('disabled');

				if (data.loggedIn != 1) {
					productWishListButton.attr('href', '/' + Lang.current + '/panel/wishlist');
					productWishListButton.attr('class', 'button panel-ajax-link');

					Panel.initPanels(productWishListButton);
				}

				productWishListButton.append(productWishListIcon);
			}
			else
			{
				productWishListButton.append(productWishListIconRemove);
			}

			productWishListDiv.append(productWishListButton);
			productWishListButton.attr('data-id-product', id_product);

			// In cart
			if (data.inCart != 1)
			{
				var cartOptions = data.context == 'wishlist' ? {reload:true} : {};

				productActionButton.click(function(e)
				{
					e.preventDefault();

					self.addToCart(id_product, id_selector, cartOptions);
				});
			}
			else
			{
				productActionButton.addClass('disabled');
				productActionButton.attr('disabled', 'disabled');
			}

			// In Wishlist
			if (data.inWishlist != 1 && data.context != 'wishlist')
			{
				productWishListButton.click(function(e)
				{
					e.preventDefault();
					self.addProductToWishlist(id_product, id_selector);
				});
			}

			if (data.context == 'wishlist')
			{
				productWishListButton.click(function(e)
				{
					e.preventDefault();
					self.removeProductFromWishlist(id_product, id_selector, {reload:true});
				});
			}

			// Preorder or not
			if (now.getTime() < pre_date.getTime())
			{
				add_date = true;
				productPriceDiv.addClass('product-detail-price-coming');
				productDateDiv.html(Lang.get('product_article_in_stock') + ' ' + pre_date_str);

				productActionDiv.attr('class', 'product-action-pre-order');
				productActionText = Lang.get('product_label_preorder');
			}
			else
			{
				add_stock = true;
				productPriceDiv.addClass('product-detail-price');
			}
		}
		else
		{
			add_sold_out = true;

			productPriceDiv.addClass('product-detail-price-coming');
			productRequestDiv.append(productRequestSpanNb, productRequestSpanMsg);

			if (data.enableRequest == 1)
			{
				add_request = true;
				productActionDiv.attr('class', 'product-action-mail');
				productActionText = Lang.get('product_label_i_want');

				if (data.inRequest == 1)
				{
					productActionButton.addClass('disabled');
					productActionButton.attr('disabled', 'disabled');
					productActionButton.prepend($('<i/>', {class:'material-icons', html:'&#xE876;'}));
				}
				else
				{
					if (data.loggedIn != 1)
					{
						productActionButton.attr('href', '/' + Lang.current + '/panel/want_it');
						productActionButton.attr('class', 'button panel-ajax-link');

						Panel.initPanels(productActionButton);
					}
					else
					{
						productActionButton.click(function(e)
						{
							e.preventDefault();

							if (data.loggedIn == 1)
								self.requestOnProduct(id_product, id_selector);
						});
					}
				}
			}
			else
			{
				add_price = false;
				productActionButton.addClass('disabled');
				productActionDiv.attr('class', 'product-action-discontinued');
				productActionText = Lang.get('product_label_discontinued');
			}
		}

		productActionButton.append(productActionText);
		productActionDiv.append(productActionButton);

		if (data.inStock > 0)
			productActionDiv.append(productWishListDiv);

		if (add_price) detailCont.append(productPriceDiv);
		actionCont.append(productActionDiv);

		if (add_sold_out) detailCont.append(productSoldOutDiv);
		if (add_request) detailCont.append(productRequestDiv);
		if (add_date) detailCont.append(productDateDiv);
		if (add_stock)
		{
			console.log(productStockDiv);
			if(data.inStock < 51 ) detailCont.append(productStockDiv);
		}
	},


	updateAddToCartButton: function(id_product, id_selector)
	{
		var is_configurable = id_product != id_selector ? true : false;

		if (is_configurable)
		{
			var select = $('.selectProductOption[data-id-selector=' + id_selector + ']').first(),
				selected = $('option[data-id-product=' + id_product + ']', $(select)).first();

			if (selected.length > 0)
			{
				data = selected.data();

				data['id_product'] = selected.val();

				this.buildAddToCartButton(data, id_selector);
			}
		}
		else
		{
			var input = $('.inputProductOption[data-id-selector=' + id_selector + ']').first();

			if (input.length > 0)
			{
				var id_selector =  $(input).attr('data-id-selector'),
					data = $(input).data();

				data['id_product'] = $(input).attr('data-id-product');

				this.buildAddToCartButton(data, id_selector);
			}
		}
	},


	initCartAddToWishlist: function()
	{
		var self = this,
			btn = $('.btnCartAddToWishList');

			$(btn).click(function(e)
			{
				e.preventDefault();

				var id_product = $(this).attr('data-id-product'),
					id_selector = $(this).attr('data-id-selector');

				self.addProductToWishlist(id_product, id_selector, {reload:true});
			});
	},


	initCartUpdateQty: function()
	{
		var self = this,
			select = $('.selectNbInCart');

		$(select).change(function(e)
		{
			e.preventDefault();

			var id_product = $(this).attr('data-id-product'),
				qty = $(this).val();

			self.updateCartQty(id_product, qty);
		});
	},


	initCartRemoveFromCart: function()
	{
		var self = this,
			btn = $('.btnRemoveProductFromCart');

		$(btn).click(function(e)
		{
			e.preventDefault();

			var id_product = $(this).attr('data-id-product'),
				id_selector = $(this).attr('data-id-selector');

			self.removeFromCart(id_product, id_selector, {reload:true});
		});
	},


	initCartRemoveFromErrorPackage: function()
	{
		var self = this,
			btn = $('.btnRemoveProductFromErrorPackage');

		$(btn).click(function(e)
		{
			e.preventDefault();

			var id_product = $(this).attr('data-id-product'),
				qty = $(this).attr('data-qty'),
				id_selector = $(this).attr('data-id-selector'),
				cart_qty = $(this).attr('data-in-cart-qty'),
				new_qty = cart_qty - qty;

			self.updateCartQty(id_product, new_qty);
		});
	},


	initSelectShippingMode: function()
	{
		var self = this,
			select = $('.selectShippingMode');

		$(select).change(function(e)
		{
			e.preventDefault();

			var id_package = $(this).attr('data-id-package'),
				id_shipping_mode = $(this).val();

			self.setShippingMode(id_package, id_shipping_mode, $(this));
		});
	},


	initBtnCheckout: function()
	{
		var self = this,
			btn = $('#btnCheckout');

		// Default validator options
		$.validator.setDefaults(this.settings.formValidator);

		$.validator.addMethod("noSpace", function(value, element) {
			return value == '' || value.trim().length != 0;
		}, Lang.get('user_message_error_no_empty_value'));


		var formValidatorRegister = $('#formRegister').validate({
			errorElement: "div",
			errorClass: 'form-message-input error',
			errorPlacement: function(error, element)
			{
				element.before(error);
			},

			rules: {
				password: {	required: true,	minlength: 5, noSpace: true},
				password2: {required: true,	minlength: 5,equalTo: "#password"},
				email: {required: true,	email: true, noSpace: true }
			},
			messages: {
				password: {
					required: Lang.get('user_message_error_password_required'),
					minlength: Lang.get('user_message_error_password_minlength'),
				},
				password2: {
					required: Lang.get('user_message_error_password_required'),
					minlength: Lang.get('user_message_error_password_minlength'),
					equalTo: Lang.get('user_message_error_password_match')
				},
				email: {
					required: Lang.get('user_message_error_email_required'),
					email: Lang.get('user_message_error_required')
				}
			}
		});

		var	formValidatorAddress = $('#formDeliveryAddress').validate({
			errorElement: "div",
			errorClass: 'form-message-input error',
			errorPlacement: function(error, element)
			{
				element.before(error);
			},
			rules: {
				firstname: {required: true, noSpace: true},
				lastname: {required: true, noSpace: true},
				phone: {required: true, noSpace: true},
				address: {required: true, noSpace: true},
				zip: {required: true, noSpace: true},
				city: {required: true, noSpace: true}
			},
			messages: {
				firstname: {required: Lang.get('user_message_error_required')},
				lastname: {required: Lang.get('user_message_error_required')},
				phone: {required: Lang.get('user_message_error_required')},
				address: {required: Lang.get('user_message_error_required')},
				zip: {required: Lang.get('user_message_error_required')},
				city: {required: Lang.get('user_message_error_required')}
			}
		});


		var formValidatorPayment = $('#formPaymentMethod').validate({
			errorElement: "div",
			errorClass: 'form-message-input error',
			ignore: '',
			rules: {
				payment_gateway: 'required'
			},
			messages: {
				payment_gateway: Lang.get('cart_label_error_please_select_payment_method')
			},
			errorPlacement: function(error, element)
			{
				$('#formPaymentMethod').prepend(error);
			},
			invalidHandler: function(form, validator) {

				if (!validator.numberOfInvalids())
					return;

				window.location.hash = '#titleFormPaymentMethod';
			}
		});

		// Email check
		if ($('#selectAddress').length == 0)
		{
			$('#registerInputEmail').blur(function()
			{
				var email = $('#registerInputEmail').val();

				User.exists(email, {
					onSuccess: function(json)
					{
						if (json.status && json.status == 'success')
						{
							$('#divErrorEmailExists').remove();

							var aNew= $('<a/>', {id:'btnCartGetNewPassword', href: '/shop/user/password', html: Lang.get('user_message_cart_get_a_new_password')});
							var aLogin = $('<a/>', {id:'btnCartLogin2', href: '/shop/user/login', html: Lang.get('user_message_cart_get_login')});

							$('#formRegister').prepend(
								$('<div/>', {id: 'divErrorEmailExists', class:'form-message warning'}).append(
									$('<p/>', {class:'form-message-title', html: Lang.get('user_title_warning')}),
									$('<p/>').append(
										$('<span/>', {html: Lang.get('user_message_this_email_already_exists')}),
										$('<br/>'),
										aNew,
										$('<span/>', {html:' '}),
										$('<span/>', {html: Lang.get('user_message_or')}),
										$('<span/>', {html:' '}),
										aLogin
									)
								)
							);

							Panel.initPanels('#btnCartLogin2');
							Panel.initPanels('#btnCartGetNewPassword');
						}
					},
					onError: function()
					{
						$('#divErrorEmailExists').remove();
					}
				});
			});
		}

		// Sends the data
		$(btn).click(function(e)
		{
			e.preventDefault();

			//  The user is logged in
			if ($('#selectAddress').length > 0)
			{
				// var id_address = $('#selectAddress').val();

				var selected = $('option:selected', $('#selectAddress')).first();

				if ( ! selected.attr('data-id-address'))
				{
					$('#selectAddress').before(
						$('<div/>', {class:'form-message-input error', html:Lang.get('user_message_error_select_address')})
					);
				}
				else
				{
					if (formValidatorPayment.form())
					{
						var post = {
								id_address: selected.val()
							},
							data =  $('#formPaymentMethod').serializeArray();

						$.each(data, function(key, obj)
						{
							post[obj.name] = obj.value;
						});

						$.ajax(
							self.domain + '/shop/shop/validate_cart',
							{
								method: 'POST',
								data: post,
								dataType: "json",
								success: function()
								{
									self.getCheckoutPanel();
								},
								// Receives
								error: function(xhr, status, error)
								{
									var json = xhr.responseJSON;

									if (json.message)
									{
										$('#formPaymentMethod').append(
											$('<div/>', {class:'form-message error'}).append(
												$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
												$('<p/>', {html: json.message})
											)
										);
									}
								}
							}
						);
					}
				}
			}
			// The user is not logged in : Check the address and create the user
			else
			{
				if (
					formValidatorRegister.form()
					&& formValidatorAddress.form()
					&& formValidatorPayment.form()
				)
				{
					var post = {};

					$.each($('#formRegister').serializeArray(), function(key, obj)
					{
						post[obj.name] = obj.value;
					});

					$.each($('#formDeliveryAddress').serializeArray(), function(key, obj)
					{
						post[obj.name] = obj.value;
					});

					$.each($('#formPaymentMethod').serializeArray(), function(key, obj)
					{
						post[obj.name] = obj.value;
					});

					$.ajax(
						self.domain + '/shop/shop/validate_cart',
						{
							method: 'POST',
							data: post,
							dataType: "json",
							success: function()
							{
								self.getCheckoutPanel();
							},
							error: function(xhr, status, error)
							{
								var json = xhr.responseJSON;

								if (json.message)
								{
									$('#formPaymentMethod').append(
										$('<div/>', {class:'form-message error'}).append(
											$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
											$('<p/>', {html: json.message})
										)
									);
								}
							}
						}
					);
				}
			}
		});
	},


	initAddressSelect: function()
	{
		var self = this,
			select = $('#selectAddress'),
			addressContainer = $('#selectAddressContainer');

		$('#selectAddressOptionEdit').click(function(){
			window.location.assign(self.domain + '/shop/user/profile/delivery_addresses');
		});

		$('#selectAddressOptionCreate').click(function(){
			window.location.assign(self.domain + '/shop/user/profile/delivery_addresses');
		});

		$('#selectAddressOptionLogout').click(function(){
			window.location.assign(self.domain + '/shop/user/logout');
		});

		$('.cartAddress', addressContainer).hide();

		select.change(function()
		{
			var selected = $('option:selected', $(this)).first();

			self.displayCurrentCartAddress(selected.val());

			if (selected.attr('data-id-address') && self.getData('id_address') != selected.attr('data-id-address'))
			{
				self.setData('id_address', selected.attr('data-id-address'));

				self.setCartZoneFromAddress(selected.attr('data-id-address'));
			}
		});

		// First display
		var selected = $('option:selected', $(select)).first();

		if (selected.attr('data-id-address'))
		{
			self.displayCurrentCartAddress(selected.val());
			self.setCartZoneFromAddress(selected.attr('data-id-address'), {reload: false});
		}
	},


	displayCurrentCartAddress: function(id_address)
	{
		var addressContainer = $('#selectAddressContainer');

		$('.cartAddress', addressContainer).hide();

		$('.cartAddress', addressContainer).each(function()
		{
			if ($(this).attr('data-id-address') == id_address)
			{
				$(this).show();
			}
		});
	},


	updateCartNbItems: function ()
	{
		$.ajax(
			this.domain + '/shop/shop/get_cart_nb_items',
			{
				method: "POST",
				dataType: "json",
				data: {
				},
				success: function(html)
				{
					var nb_items = html['nb'];

					if(nb_items == 0)
					{
						$('.cartIcon').removeAttr('class').addClass('cartIcon panel-ajax-link');
					}

					if(nb_items >= 1 && nb_items <= 9)
					{
						$('.cartIcon').removeAttr('class').addClass('cart-taken-' + nb_items + ' cartIcon panel-ajax-link');
					}

					if(nb_items >= 10)
					{
						$('.cartIcon').removeAttr('class').addClass('cart-taken-10' + ' cartIcon panel-ajax-link');
					}
				}
			}
		);
	},


	addToCart: function(id_product, id_selector)
	{
		var self = this,
			options = $.type(arguments[2]) != 'undefined' ? arguments[2] : {}

		$.ajax(
			this.domain + '/shop/shop/add_to_cart',
			{
				method: "POST",
				dataType: "json",
				data: {
					id_product: id_product
				},
				success: function()
				{
					self.updateProductDataStatus(id_selector, id_product, 'cart', 'add');

					self.removeProductFromWishlist(id_product, id_selector, options);

					self.updateAddToCartButton(id_product, id_selector);

					self.updateCartNbItems();
				}
			}
		);
	},


	removeFromCart: function(id_product, id_selector)
	{
		var self = this,
			options = typeof(arguments[2]) != 'undefined' ? arguments[2] : {};

		$.ajax(
			this.domain + '/shop/shop/remove_from_cart',
			{
				method: "POST",
				dataType: "json",
				data: {
					id_product: id_product
				},
				success: function()
				{
					if (options.reload)
						self.reloadCart();

					self.updateProductDataStatus(id_selector, id_product, 'cart', 'remove');

					self.updateAddToCartButton(id_product, id_selector);

					self.updateCartNbItems();
				}
			}
		);
	},


	requestOnProduct: function(id_product, id_selector)
	{
		var self = this;

		$.ajax(
			this.domain + '/shop/user/product_request',
			{
				method: "post",
				dataType: "json",
				data: {
					id_product: id_product
				},
				success: function(json)
				{
					if (json.added == true)
					{
						self.updateProductDataStatus(id_selector, id_product, 'request', 'add');

						self.updateAddToCartButton(id_product, id_selector);
					}
				}
			}
		);
	},


	addProductToWishlist: function(id_product, id_selector)
	{
		var self = this,
			options = typeof(arguments[2]) != 'undefined' ? arguments[2] : {},
			nb = $('.wishlistIcon').attr('data-nb')
		;

		$.ajax(
			this.domain + '/shop/user/product_wishlist',
			{
				method: "post",
				dataType: "json",
				data: {
					id_product: id_product
				},
				success: function(json)
				{
					if (json.added == true)
					{
						self.updateProductDataStatus(id_selector, id_product, 'wishlist', 'add');

						// Global wishlist button
						$('.wishlistIcon').addClass('wishlist-taken');

						nb++;

						$('.wishlistIcon').attr('data-nb', nb);

						console.log($('.wishlistIcon').attr('data-nb'));

						self.removeFromCart(id_product, id_selector, options);

						self.updateAddToCartButton(id_product, id_selector);
					}
				}
			}
		);
	},


	removeProductFromWishlist: function(id_product, id_selector)
	{
		var self = this,
			options = $.type(arguments[2]) != 'undefined' ? arguments[2] : {},
			reload = $.type(options['reload']) != 'undefined' ? true : false,
			nb = $('.wishlistIcon').attr('data-nb')
		;

		$.ajax(
			self.domain + '/shop/user/delete_wishlist',
			{
				method: "post",
				data: {
					id_product: id_product
				},
				success: function(html)
				{
					if (reload)
					{
						$('.mfp-content').html(html);
						$.magnificPopup.instance.content = $('.mfp-content');
					}

					self.updateProductDataStatus(id_selector, id_product, 'wishlist', 'remove');

					nb = nb - 1;

					$('.wishlistIcon').attr('data-nb', nb);

					if(nb < 1)
					{
						$('.wishlistIcon').removeClass('wishlist-taken');
					}

					self.updateAddToCartButton(id_product, id_selector);
				}
			}
		);
	},


	deleteAllWishlist: function()
	{
		var self = this;

		$.ajax(
			self.domain + '/shop/user/delete_all_wishlist',
			{
				method: "POST",
				data: {},
				success: function(html)
				{
					$('.mfp-content').html(html);
					$.magnificPopup.instance.content = $('.mfp-content');

					$('.wishlistIcon').removeClass('wishlist-taken');

					var selects = $('.selectProductOption'),
						inputs = $('.inputProductOption');

					$.each(selects, function(idx, select)
					{
						var options = $('option[data-id-product]', $(select));

						$.each(options, function(idx2, option)
						{
							if ($(option).data('inWishlist') == 1)
							{
								$(option).data('inWishlist', '');
								self.updateAddToCartButton($(option).data('idProduct'), $(select).data('idSelector'));
							}
						});
					});

					$.each(inputs, function(idx, input)
					{
						if ($(input).data('inWishlist') == 1)
						{
							$(input).data('inWishlist', '');
							self.updateAddToCartButton($(input).data('idProduct'), $(input).data('idProduct'));
						}
					});
				}
			}
		);
	},


	updateProductDataStatus: function(id_selector, id_product, item, action)
	{
		var select = $('.selectProductOption[data-id-selector='+id_selector+']').first(),
			selected = $('option[data-id-product=' + id_product + ']', $(select)).first(),
			input = $('.inputProductOption[data-id-selector='+id_selector+']').first();

		switch(item)
		{
			case 'cart':
				if (action == 'add')
				{
					$(input).data('inCart', '1');
					$(selected).data('inCart', '1');
					$(selected).attr('data-in-cart', '1');
				}
				else
				{
					$(input).data('inCart', '');
					$(selected).data('inCart', '');
					$(selected).attr('data-in-cart', '');
				}

				break;

			case 'wishlist':
				if (action == 'add')
				{
					$(input).data('inWishlist', '1');
					$(selected).data('inWishlist', '1');
					$(selected).attr('data-in-wishlist', '1');
				}
				else
				{
					$(input).data('inWishlist', '');
					$(selected).data('inWishlist', '');
					$(selected).attr('data-in-wishlist', '');
				}

				break;

			case 'request':
				if (action == 'add')
				{
					var nbRequestDiv = $('productNbRequest[data-id-product=' + id_product + ']'),
						nb = nbRequestDiv.text().trim(),
						nb = nb == '' ? 0 : nb,
						nb_final = parseInt(nb) + 1;

					$(input).data('inRequest', '1');
					$(selected).data('inRequest', '1');
					$(selected).attr('data-in-request', '1');

					$(input).data('nbRequests', nb_final);
					$(selected).data('nbRequests', nb_final);
					$(selected).attr('data-nb-requests', nb_final);
				}

				break;
		}
	},


	updateElementAttribute: function(selector, attr, val)
	{
	    $(selector).attr(attr, val);
	},


	setCartButtonProductRequest: function(id_product)
	{
		var detailSelector = '.product-details[data-id-product=' + id_product + ']';

		$('.product-action-add-to-wish-list[data-id-product=' + id_product + ']').hide();

		$(selector).html(Lang.get('product_label_i_want'));
	},


	setCartButtonAdded: function(id_product)
	{
		var check = $('<i class="material-icons">&#xE876;</i>'),
			selector = '.btnAddToCart[data-id-product=' + id_product + ']';

		$(selector).addClass('disabled');
		$(selector).html(Lang.get('cart_label_payment_button_added'));
		$(selector).prepend(check);
	},


	updateCartQty: function(id_product, qty)
	{
		var self = this;

		$.ajax(
			this.domain + '/shop/shop/update_cart_qty',
			{
				method: "POST",
				dataType: "json",
				data: {
					id_product: id_product,
					qty: qty
				},
				success: function()
				{
					self.reloadCart();

					self.updateCartNbItems();
				}
			}
		);
	},


	setShippingMode: function(id_package, id_shipping_mode, btn)
	{
		var self = this;

		$.ajax(
			this.domain + '/shop/shop/set_shipping_mode',
			{
				method: "POST",
				dataType: "json",
				data: {
					id_package: id_package,
					id_shipping_mode: id_shipping_mode
				},
				success: function()
				{
					self.reloadCart();
				}
			}
		);
	},


	setCartZoneFromAddress: function(id_address)
	{
		var self = this,
			options = $.type(arguments[1]) != 'undefined' ? arguments[1] : {},
			reload = $.type(options['reload']) != 'undefined' ? options['reload'] : false;

		$.ajax(
			this.domain + '/shop/shop/set_cart_address',
			{
				method: "post",
				dataType: "json",
				data: {
					id_address: id_address
				},
				success: function()
				{
					self.setData('id_address', id_address);

					if (reload)
						self.reloadCart();
				}
			}
		);
	},


	getCheckoutPanel: function()
	{
		$.ajax(
			this.domain + '/shop/shop/checkout',
			{
				method: 'post',
				data: {
					reload: true
				},
				success: function(html)
				{
					$('.mfp-content').html(html);
					$.magnificPopup.instance.content = $('.mfp-content');
					$('.mfp-content').animate({scrollTop:0}, 'fast');
				}
			}
		);
	},


	reloadCart: function()
	{
		$.ajax(
			this.domain + '/shop/shop/cart',
			{
				method: 'get',
				data: {
					reload: true
				},
				success: function(html)
				{
					$('.mfp-content').html(html);

					$.magnificPopup.instance.content = $('.mfp-content');

					// Panel.initPanels('.mfp-content');
				}
			}
		);
	},


	setData: function(key, val)
	{
		this.data[key] = val;
	},


	getData: function(key)
	{
		if ($.type(this.data[key]) != 'undefined')
			return this.data[key];

		return null;
	}
};

