$(document).on('ready', function (e) {
	$(document).on('click', '.make-application-teaser .button', function (e) {
		ajaxify.go('/make-application')
	});
});
