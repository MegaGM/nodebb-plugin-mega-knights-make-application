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

				if ('checkbox' === el.prop('type'))
					el.prop('checked', data[key]).trigger('change');
				else
					el.val(data[key]);
			});
		}

		$(document).on('change', '.application-form-layout input, .application-form-layout select, .application-form-layout textarea', function (e) {
			var el = $(e.target);
			// don't even try to save fileinputs
			if ('file' === el.prop('type')) return;
			// don't save characters, because they're created dynamically
			if (el.closest('.char').length > 0) return;

			if ('checkbox' === el.prop('type'))
				store.set(storagePrefix + el.prop('id'), el.prop('checked'));
			else
				store.set(storagePrefix + el.prop('id'), el.val());
		});

		// setup
		fillApplicationForm();
		$(window).on('action:ajaxify.end', fillApplicationForm);
	});
});
