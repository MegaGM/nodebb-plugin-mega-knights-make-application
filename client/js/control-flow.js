$(document).on('ready', function (e) {
	/* ================================================
	 * startpage redirect button
	 * ===============================================*/
	$(document).on('click', '.make-application-teaser .button', function (e) {
		ajaxify.go('/make-application');
	});

	/* ================================================
	 * next buttons logic
	 * ===============================================*/
	// first step
	$(document).on('click', '.accept-instruction-btn', function (e) {
		$('.welcome-message-layout').hide();
		$('.statute-layout').show();
	});

	// second step
	$(document).on('click', '.accept-statute-btn', function (e) {
		$('.statute-layout').hide();
		$('.application-form-layout').show();
	});

	$(document).on('change', '.accept-statute-checkbox', function (e) {
		var el = $(e.target);
		el.is(':checked') ?
			$('.accept-statute-btn').attr('disabled', false) :
			$('.accept-statute-btn').attr('disabled', true);
	});
	// TODO: third step
	/* ================================================
	 * choosing game logic
	 * ===============================================*/
	$(document).on('click', '.choose-game input', function (e) {
		var el = $(e.target),
			game = el.attr('data-game'),
			show = el.is(':checked');

		if ('apb' === game)
			$('.apb-related').toggle(show);
		if ('bns' === game)
			$('.bns-related').toggle(show);
		if ('gta' === game)
			$('.gta-related').toggle(show);
	});

	/* ================================================
	 * Testing
	 * ===============================================*/
	$('#i-play-apb').trigger('click');

});
