(function () {
	// $(document).on('ready', initiateApplicationInTopic);
	$(window).on('action:ajaxify.end', initiateApplicationInTopic);

	function initiateApplicationInTopic() {
		var onTopicPage = 0 === window.location.pathname.indexOf('/topic');
		if (!onTopicPage) return;
		var mainPostVisible = $('[data-index="0"]').length;
		if (!mainPostVisible) return;
		getSummary();
	}

	function getSummary() {
		var tid = $('[data-tid]').attr('data-tid');
		if (!tid) return;

		socket.emit('plugins.makeApplication.getSummary', {
			tid: tid
		}, function (err, summary) {
			// TODO: debug
			console.log(err, summary);
			if ('break' === summary || err) return;

			setupTooltips();
			require(['handlebars', 'make-application/templates'], function (Handlebars) {
				var html = Handlebars.partials['application-status'](summary);
				$('.application-status').html(html);
			});
		});
	}

	function setupTooltips() {
		$('.application-form-topic [data-toggle="tooltip"]').tooltip({
			placement: 'top'
		});
	}
})();
