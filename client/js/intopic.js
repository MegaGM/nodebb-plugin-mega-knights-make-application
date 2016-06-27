(function () {
	$(document).on('ready', initiateApplicationInTopic);
	$(window).on('action:ajaxify.end', initiateApplicationInTopic);

	function initiateApplicationInTopic() {
		var onTopicPage = 0 === window.location.pathname.indexOf('/topic');
		if (!onTopicPage) return;
		setupTooltips();
	}

	function setupTooltips() {
		$('.application-form-topic [data-toggle="tooltip"]').tooltip({
			placement: 'top'
		});
	}
})();
