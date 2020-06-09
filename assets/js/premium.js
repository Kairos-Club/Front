// Relax (parallax scroll)
// Code méga pouris a revoir completement !!!!!!!!!!!!!!!!!
// - - - - - - - - - - - - - - - - - - - - - - - -

if ( $(window).width() > 1024) {
	if($('.rellax').length)
	{
		var rellax = new Rellax('.rellax', {
			center: true
		});
	}

}
else {
}

$(document).ready(function()
{
	// Resize for Rellax
	$(window).on('resize',function()
	{
		if ($('.site-premium').length > 0)
		{
			if ($(window).width() > 1024)
			{
				console.log('wndows resize relaod');
				// @todo
				location.reload();  // refresh page
			}
		}
	});
});

// Simple Text Rotator
// https://github.com/peachananr/simple-text-rotator
// - - - - - - - - - - - - - - - - - - - - - - - -
$(".rotate").textrotator({
	speed: 2000
});

// Fade out on scroll
// - - - - - - - - - - - - - - - - - - - - - - - -
$(window).scroll(function(){
	//$(".header-fix").css("opacity", $(window).scrollTop() / 24);
	$(".down-indicator").css("opacity", 1 - $(window).scrollTop() / 96).toggle($(this).scrollTop()<96);
	//$(".brand-home").css("opacity", 1 - $(window).scrollTop() / 96);
});

var Premium = {

	updatePriceSimulator: function ()
	{
		var price = $('#productPrice').val(),
			copiesSold = $('#copiesSoldRange').val(),
			totalSalesHt = price * copiesSold,
			totalSalesNumberHt = parseInt(totalSalesHt),
			totalSalesNumberTtc = totalSalesNumberHt + (totalSalesNumberHt * 0.2),
			shipping = 0,
			bigwaxPrice = totalSalesNumberHt * 0.15,
			selectedPayment = $('option:selected', $('#paymentMod')).first(),
			selectedDestination = $('option:selected', $('#destination')).first()
		;

		if(selectedDestination.val() == 'fr')
		{
			shipping = 4.90;
		}

		if(selectedDestination.val() == 'eu')
		{
			shipping = 8.50;
		}

		if(selectedDestination.val() == 'us')
		{
			shipping = 9.50;
		}

		if(selectedDestination.val() == 'asia')
		{
			shipping = 11.99;
		}

		var paypalPrice = ((totalSalesNumberTtc + shipping * copiesSold) * 0.0365) + (0.25 * copiesSold),
			moneticoPrice = (totalSalesNumberTtc + shipping * copiesSold) * 0.015
		;

		$('#totalSales').empty();
		$('#bigwax').empty();
		$('#paymentModPrice').empty();
		$('#totalCost').empty();

		$('#totalSales').html(totalSalesHt + '€');
		$('#bigwax').html('- ' +bigwaxPrice + '€');

		if(selectedPayment.val() == 'paypal')
		{
			var total_cost = totalSalesNumberHt - ((totalSalesNumberTtc + (shipping * copiesSold)) * 0.0365 + (0.25 * copiesSold)) - (totalSalesNumberHt * 0.15);

			$('#paymentModPrice').html('- ' + Math.round(paypalPrice) + '€');
			$('#totalCost').html(Math.round(total_cost));
		}
		else
		{
			var total_cost = totalSalesNumberHt - ((totalSalesNumberTtc + (shipping * copiesSold)) * 0.015) - (totalSalesNumberHt * 0.15);

			$('#paymentModPrice').html('- ' + Math.round(moneticoPrice) + '€');
			$('#totalCost').html(Math.round(total_cost));
		}
	},


	//Update when change on Product Price
	initSimulatorTotalSales: function()
	{
		var select = $('#productPrice'),
			self = this
		;

		$(select).change(function(e)
		{
			e.preventDefault();

			self.updatePriceSimulator();
		});
	},


	//Update when change on Payment Mod(Paypal / Monetico)
	initPaymentMod: function() {
		var select = $('#paymentMod'),
			self = this
		;

		$(select).change(function (e) {
			e.preventDefault();

			self.updatePriceSimulator();
		});
	},


	//Update when change on Destination
	initDestination: function()
	{
		var select = $('#destination'),
			self = this
		;

		$(select).change(function(e)
		{
			e.preventDefault();

			self.updatePriceSimulator();
		});
	},


	//Update when change on Copies Sold(Range)
	initCopiesSold: function ()
	{
		var self = this;

		$('#copiesSoldRange').on("change", function ()
		{
			self.updatePriceSimulator();
		})
	}
};
