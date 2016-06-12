var characterApbIndex = 0;
$(document).on('ready', function (e) {
	/* ================================================
	 * characters logic
	 * ===============================================*/
	// on adding character
	$(document).on('click', '.characters-apb .characters-add-apb', function (e) {
		app.parseAndTranslate('partials/apb-character', {
			characterApbIndex: ++characterApbIndex
		}, function (html) {
			$('.characters-apb .characters').append(html);
		});
	});

	// on removing character
	$(document).on('click', '.characters-apb .characters-remove-apb', function (e) {
		var el = $(e.target);
		$('#character-apb-' + el.attr('data-character-index')).remove();
	});
});
