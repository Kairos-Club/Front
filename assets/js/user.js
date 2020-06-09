/**
 * User object
 *
 * @type {{domain, form: {ids: {login: string, register: string}}, login: User.login, register: User.register, request: User.request}}
 */
var User = {

	domain: window.location.protocol + '//' + window.location.hostname,

	validators: {},

	form: {
		ids: {
			login: '#formLogin',
			register: '#formRegister',
			password: '#formPassword',
			createAddress: '#formSaveAddress',
			credentials: '#formCredentials'
		},

		validator: {
			validClass: 'success',
			errorElement: "div",
			errorClass: 'form-message-input error',

			errorPlacement: function(error, element)
			{
				element.before(error);
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


	initAddressForm: function()
	{
		var self = this;

		// Default validator options
		$.validator.setDefaults(this.form.validator);

		$.validator.addMethod("noSpace", function(value, element) {
			return value == '' || value.trim().length != 0;
		}, Lang.get('user_message_error_no_empty_value'));

		this.validators['createAddress'] = $(this.form.ids.createAddress).validate({
			rules: {
				address_name: {	required: true, noSpace: true},
				firstname: {required: true, noSpace: true},
				lastname: {required: true, noSpace: true},
				phone: {required: true, noSpace: true},
				address: {required: true, noSpace: true},
				address_2: {required: false},
				zip: {required: true, noSpace: true},
				city: {required: true, noSpace: true},
				state: {required: false}
			}
		});

		// Init the "Save" button
		$('#btnSaveAddress').click(function()
		{
			// Run the form validation

			self.saveAddress($(this).attr('data-id-address'));
		});
	},

	initCredentialsForm: function()
	{
		var self = this;

		// Default validator options
		$.validator.setDefaults(this.form.validator);

		$.validator.addMethod("noSpace", function(value, element) {
			return value == '' || value.trim().length != 0;
		}, Lang.get('user_message_error_no_empty_value'));


		this.validators['credentials'] = $(this.form.ids.credentials).validate({
			rules: {
				password: {	required: false,	minlength: 5, noSpace: true},
				password2: {required: false,	minlength: 5,equalTo: "#password"},
				email: {required: true,	email: true, noSpace: true}
			},
			messages: {
				password: {
					required: Lang.get('user_message_error_password_required'),
					minlength: Lang.get('user_message_error_password_minlength')
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

		// Init the "Save" button

		$('#saveCredentials').click(function()
		{
			self.saveCredentials();
		});
	},


	login: function()
	{
		var self = this,
			form = $(self.form.ids.login),
			email = $('input[name=email]', form).val(),
			pwd = $('input[name=password]', form).val();

		$.ajax(
			this.domain + '/shop/user/login',
			{
				method: "POST",
				dataType: "json",
				data: {
					email: email,
					password: pwd
				},
				success: function(json)
				{
					if (Cookies.get('from'))
					{
						if (Cookies.get('from') == 'cart')
						{
							Cookies.remove('from');

							$('#iconProfile').attr('href', '/' + Lang.current + '/shop/user/profile/welcome');
							$('#iconProfile').removeClass('panel-ajax-link').addClass('user-connected');
							$('#iconProfile').off();

							Shop.reloadCart();
						}
					}
					else
						window.location.assign(self.domain + '/shop/user/profile/welcome');
				},
				// Receives
				error: function(xhr, status, error)
				{
					$('input', form).removeClass('error');
					$('.form-message-input', form).remove();
					$('.form-message', form).remove();

					if (status == 'error')
					{
						var json = xhr.responseJSON;

						// Error on fields
						if (json.fields)
						{
							$.each(json.fields, function (field, msg)
							{
								$('input[name='+field+']', form).addClass('error');

								$('input[name='+field+']', form).before(
									$('<div/>', {class:'form-message-input error', text: msg})
								);
							});
						}
						// General message
						else if (json.message)
						{
							$(form).prepend(
								$('<div/>', {class:'form-message error'}).append(
									$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
									$('<p/>', {html: json.message})
								)
							);
						}
					}
				}
			}
		);
	},


	cartLogin: function()
	{
		var self = this,
			form = $(self.form.ids.login),
			email = $('input[name=email]', form).val(),
			pwd = $('input[name=password]', form).val();

	},


	register: function()
	{
		var self = this,
			form = $(self.form.ids.register),
			pwd = $('input[name=password]', form).val(),
			pwd2 = $('input[name=password2]', form).val(),
			email = $('input[name=email]', form).val();

		if ( ! Tools.validateEmail(email))
		{
			$(form).prepend(
				$('<div/>', {class:'form-message error'}).append(
					$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
					$('<p/>', {html: Lang.get('user_label_error_email')})
				)
			);

			$('label[for=registerInputEmail]', form).addClass('error');
			$('input[name=email]', form).addClass('error');
		}
		else if (pwd != pwd2)
		{
			$(form).prepend(
				$('<div/>', {class:'form-message error'}).append(
					$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
					$('<p/>', {html: Lang.get('user_label_error_password_no_match')})
				)
			);

			$('label[for=passwordConfirm]', form).addClass('error');
			$('input[name=password2]', form).addClass('error');
		}
		else
		{
			$.ajax(
				this.domain + '/shop/user/register',
				{
					method: "POST",
					dataType: "json",
					data: {
						email: email,
						password: pwd
					},
					success: function(json)
					{
						// Do stuff...
						window.location.assign(self.domain + '/shop/user/profile');
					},
					error: function(xhr, status, error)
					{
						$('input', form).removeClass('error');
						$('label.error', form).remove();
						$('.form-message', form).remove();

						if (status == 'error')
						{
							var json = xhr.responseJSON;
							// Error on fields
							if (json.fields) {
								$.each(json.fields, function (field, msg) {
									$('input[name=' + field + ']', form).addClass('error');

									$('input[name=' + field + ']', form).before(
										$('<label/>', {class: 'error', text: msg})
									);
								});
							}
							else if (json.message)
							{
								$(form).prepend(
									$('<div/>', {class:'form-message error'}).append(
										$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
										$('<p/>', {html: json.message + '&nbsp;'}).append(
											$('<a/>', {id:'btnPassword', href: self.domain + '/shop/user/password', html: Lang.get('user_label_forgot_password')})
										)
									)
								);

								Panel.initPanels('#btnPassword', {post: {email: email}});
							}
						}
					}
				}
			);
		}
	},


	exists: function(email)
	{
		var options = $.type(arguments[1]) != 'undefined' ? arguments[1] : {};

		$.ajax(
			this.domain + '/shop/user/exists',
			{
				method: "POST",
				dataType: "json",
				data: {
					email: email
				},
				success: function(json)
				{
					if (options.onSuccess)
						options.onSuccess(json);
				},
				error: function(xhr, status, error)
				{
					var json = xhr.responseJSON;
					if (options.onError)
						options.onError(json);
				}
			}
		);
	},


	sendPassword: function()
	{
		var self = this,
			form = $(self.form.ids.password),
			email = $('input[name=email]', form).val()
		;

		$.ajax(
			this.domain + '/shop/user/password',
			{
				method: "POST",
				dataType: "json",
				data: {
					email: email
				},
				success: function(json)
				{
					$(form).empty();

					$(form).append(
						$('<div/>', {class:'form-message success valid'}).append(
							$('<p/>', {class:'form-message-title', html: Lang.get('user_title_success')}),
							$('<p/>', {html: Lang.get('user_label_success_password_sent')})
						)
					);
				},
				// Receives
				error: function(xhr, status, error)
				{
					$('input', form).removeClass('error');
					$('.form-message-input', form).remove();
					$('.form-message', form).remove();

					if (status == 'error')
					{
						var json = xhr.responseJSON;

						// Error on fields
						if (json.fields)
						{
							$.each(json.fields, function (field, msg)
							{
								$('input[name='+field+']', form).addClass('error');

								$('input[name='+field+']', form).before(
									$('<div/>', {class:'form-message-input error', text: msg})
								);
							});
						}
						// General message
						else if (json.message)
						{
							$(form).prepend(
								$('<div/>', {class:'form-message error'}).append(
									$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
									$('<p/>', {html: json.message})
								)
							);
						}
					}
				}
			}
		);
	},


	changePassword: function()
	{
		var self = this,
			form = $(self.form.ids.credentials),
			email = $('input[name=email]', form).val()
		;


		$.ajax(
			this.domain + '/shop/user/password',
			{
				method: "POST",
				dataType: "json",
				data: {
					email: email
				},
				success: function(json)
				{
					$(form).empty();

					$(form).append(
						$('<div/>', {class:'form-message success valid'}).append(
							$('<p/>', {class:'form-message-title', html: Lang.get('user_title_success')}),
							$('<p/>', {html: Lang.get('user_label_success_password_sent')})
						)
					);

					// $(form).remove();
				},
				// Receives
				error: function(xhr, status, error)
				{
					$('input', form).removeClass('error');
					$('.form-message-input', form).remove();
					$('.form-message', form).remove();

					if (status == 'error')
					{
						var json = xhr.responseJSON;

						// Error on fields
						if (json.fields)
						{
							$.each(json.fields, function (field, msg)
							{
								$('input[name='+field+']', form).addClass('error');

								$('input[name='+field+']', form).before(
									$('<div/>', {class:'form-message-input error', text: msg})
								);
							});
						}
						// General message
						else if (json.message)
						{
							$(form).prepend(
								$('<div/>', {class:'form-message error'}).append(
									$('<p/>', {class:'form-message-title', html: Lang.get('user_title_error')}),
									$('<p/>', {html: json.message})
								)
							);
						}
					}
				}
			}
		);

	},


	getAddress: function(id_address, id_customer)
	{
		$('#createAddressbuttonDiv').hide();

		var self = this;

		$.ajax(
			self.domain + '/shop/user/get_address_editable_view',
			{
				method: "POST",
				data: {
					id_customer: id_customer,
					id_address: id_address
				},
				success: function(html)
				{

					$('#profileAddressContainer').html(html);

				},
				error: function(xhr, status, error)
				{
				}
			}
		);
	},


	deleteAddress: function(id_address)
	{
		var self = this;

		$.ajax(
			self.domain + '/shop/user/delete_address',
			{
				method: "POST",
				data: {
					id_address: id_address
				},
				success: function(html)
				{
					$('#profileAddressContainer').html(html);
				},
				error: function(xhr, status, error)
				{
				}
			}
		);
	},


	saveAddress: function(id_address)
	{
		if (this.validators['createAddress'].form())
		{

			var self = this,
				form = $(self.form.ids.createAddress),
				address_name = $('input[name=address_name]', form).val(),
				firstname = $('input[name=firstname]', form).val(),
				lastname = $('input[name=lastname]', form).val(),
				phone = $('input[name=phone]', form).val(),
				address = $('input[name=address]', form).val(),
				address2= $('input[name=address_2]', form).val(),
				city = $('input[name=city]', form).val(),
				state = $('input[name=state]', form).val(),
				zip = $('input[name=zip]', form).val(),
				id_country = $('select[name=id_country]', form).val();

			$.ajax(
				this.domain + '/shop/user/save_address',
				{
					method: "POST",
					data: {
						address_name: address_name,
						firstname: firstname,
						lastname: lastname,
						phone: phone,
						address: address,
						address_2: address2,
						city: city,
						state: state,
						zip: zip,
						id_country: id_country,
						id_address: id_address
					},
					success: function(html)
					{
						$('#createAddressbuttonDiv').show();
						$('#profileAddressContainer').html(html);
					},
					error: function(xhr, status, error)
					{

					}
				}
			);
		}
	},


	saveCredentials: function()
	{
	    if (this.validators['credentials'].form())
		{
			var self = this,
				form = $(self.form.ids.credentials),
				old_email = $('input[name=old_email]', form).val(),
				email = $('input[name=email]', form).val(),
				pwd = $('input[name=password]', form).val();

			$.ajax(
				this.domain + '/shop/user/change_credentials',
				{
					method: "POST",
					data: {
						old_email: old_email,
						email: email,
						pwd: pwd
					},
					success: function(html)
					{
						$('#profileSettingsContainer').html(html);
						$('.valid').show();
					},
					error: function(xhr, status, error)
					{
					}
				}
			);
		}
	},


	deleteIWant: function(id_product)
	{
		var self = this;

		$.ajax(
			self.domain + '/shop/user/delete_i_want',
			{
				method: "POST",
				data: {
					id_product: id_product
				},
				success: function(html)
				{
					$('#profileIWantContainer').html(html);
				},
				error: function(xhr, status, error)
				{
				}
			}
		);
	},



	setData: function(key, val)
	{
	    this.data[key] = val;
	},


	getData: function()
	{
		if ($.type(this.data[key]) != 'undefined')
			return this.data[key];

		return null;
	}
};
