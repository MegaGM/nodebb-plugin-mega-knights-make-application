var charI = 0;
$(document).on('ready', function (e) {
	/* ================================================
	 * characters logic
	 * ===============================================*/
	// on adding character
	$(document).on('click', '.application-form-layout .charlist-add', function (e) {
		var el = $(e.target),
			game = el.closest('[data-game]').attr('data-game'),
			gameCid = el.closest('[data-game-cid]').attr('data-game-cid');

		require(['handlebars', 'knights-make-application/templates'], function (Handlebars) {
			var html = Handlebars.partials['characters/' + game]({
				charI: ++charI,
				gameCid: gameCid
			});
			el.closest('[data-game]').find('.charlist').append(html);
		});
		// app.parseAndTranslate('partials/' + game + '-character', {
		// 	charI: ++charI
		// }, function (html) {
		// 	el.closest('[data-game]').find('.charlist').append(html);
		// });
	});

	// on removing character
	$(document).on('click', '.application-form-layout .charlist-remove', function (e) {
		var el = $(e.target);
		el.closest('.char').remove();
	});
});
