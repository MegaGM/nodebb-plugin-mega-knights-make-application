(function () {
	// $(document).on('ready', initiateApplicationInTopic);
	$(window).on('action:ajaxify.end', initiateApplicationInTopic);

	$(document).on('click', '.application-controls [data-vote]', function (e) {
		var el = $(e.target),
			type = el.attr('data-vote'),
			tid = $('[data-tid]').attr('data-tid');
		if (!tid) return;
		vote(tid, type);
	});

	function vote(tid, type) {
		socket.emit('plugins.makeApplication.vote', {
			tid: tid,
			type: type
		}, function (err, summary) {
			if ('break' === summary || err) return;
			getSummary(tid);
		});
	}

	function initiateApplicationInTopic() {
		var onTopicPage = 0 === window.location.pathname.indexOf('/topic');
		if (!onTopicPage) return;
		var mainPostVisible = $('[data-index="0"]').length;
		if (!mainPostVisible) return;
		var tid = $('[data-tid]').attr('data-tid');
		if (!tid) return;
		getSummary(tid);
		getControls(tid);
	}

	function getControls(tid) {
		socket.emit('plugins.makeApplication.getControls', {
			tid: tid
		}, function (err, controls) {
			if ('break' === controls || err) return;
			processControls(controls);
		});
	}

	function processControls(controls) {
		// re-render controls
		require(['handlebars', 'make-application/templates'], function (Handlebars) {
			var html = Handlebars.partials['application-controls']({
				controls: controls
			});
			$('.application-controls').html(html);
		});
	}

	function getSummary(tid) {
		socket.emit('plugins.makeApplication.getSummary', {
			tid: tid
		}, function (err, summary) {
			if ('break' === summary || err) return;
			if (!summary || !summary.votes || !summary.status)
				return console.log('no summary');
			processSummary(summary);
			setupTooltips();
		});
	}

	function processSummary(summary) {
		// compute progress bars' width
		var minWidth = 5; // percents
		var
			pos = {},
			neg = {},
			jf = {};
		pos.abs = parseInt(summary.votes.positive);
		neg.abs = parseInt(summary.votes.negative);
		jf.abs = parseInt(summary.votes.jellyfish);

		// get width of one vote in percents
		var total = pos.abs + neg.abs + jf.abs,
			pWidth = (100 - (minWidth * 3)) / total;

		// compute relative % of votes to each other
		pos.p = +((100 / total) * pos.abs).toFixed(2);
		neg.p = +((100 / total) * neg.abs).toFixed(2);
		jf.p = +((100 / total) * jf.abs).toFixed(2);

		// compute final width of votes progress bars
		pos.w = (pos.abs * pWidth) + minWidth;
		neg.w = (neg.abs * pWidth) + minWidth;
		jf.w = (jf.abs * pWidth) + minWidth;

		// re-render progress bars
		var container = $('.application-votes');
		container
			.find('.positive').css('width', pos.w + '%')
			.find('.percents').text(pos.p + '%');
		container
			.find('.negative').css('width', neg.w + '%')
			.find('.percents').text(neg.p + '%');
		container
			.find('.jellyfish').css('width', jf.w + '%')
			.find('.percents').text(jf.p + '%');

		// re-render status
		require(['handlebars', 'make-application/templates'], function (Handlebars) {
			var html = Handlebars.partials['application-status'](summary);
			$('.application-status').html(html);
		});
	}

	function setupTooltips() {
		$('.application-form-topic [data-toggle="tooltip"]').tooltip({
			placement: 'top'
		});
	}
})();
