$(document).on('ready', function (e) {
	/* ================================================
	 * localStorage manipulations
	 * ===============================================*/
	var storagePrefix = 'make-application:',
		localStorePath = '../../plugins/nodebb-plugin-mega-knights-make-application/js/lib/store.min.js';
	require([localStorePath], function (store) {

		function fillApplicationForm() {
			if ('/make-application' !== window.location.pathname) return;
			if (!store || !store.enabled) return console.error('LocalStorage is not available');

			var data = store.getAll();
			Object.keys(data).forEach(function (key, i) {
				if (0 !== key.indexOf(storagePrefix)) return;
				var el = $('#' + key.replace(storagePrefix, ''));
				if (1 !== el.length) return;

				'checkbox' === el.attr('type') ?
					el.attr('checked', data[key]) :
					el.val(data[key]);
			});
		}

		$(document).on('change', '.application-form-layout input, .application-form-layout select, .application-form-layout textarea', function (e) {
			var el = $(e.target);
			if (el.closest('.character').length > 0) return;
			if ('file' === el.attr('type')) return;

			if ('checkbox' === el.attr('type')) {
				// don't save state if it's choose-game checkbox
				if (el.closest('.choose-game').length > 0) return;

				store.set(storagePrefix + el.attr('id'), el.is(':checked'));
			} else {
				store.set(storagePrefix + el.attr('id'), el.val());
			}
		});

		// setup
		fillApplicationForm();
		$(window).on('action:ajaxify.end', fillApplicationForm);
	});
});
