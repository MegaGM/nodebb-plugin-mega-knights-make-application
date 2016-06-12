$(document).on('ready', function (e) {
	/* ================================================
	 * startpage redirect button
	 * ===============================================*/
	$(document).on('click', '.make-application-teaser .button', function (e) {
		ajaxify.go('/make-application');
	});

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
	// third step
	/* ================================================
	 * choosing game logic
	 * ===============================================*/
	$(document).on('click', '.choose-game input', function (e) {
		var el = $(e.target),
			game = el.attr('data-game'),
			show = el.is(':checked');
		console.log('checked game: ', el, show);

		if ('apb' === game)
			$('.apb-related').toggle(show);
		if ('bns' === game)
			$('.bns-related').toggle(show);
		if ('gta' === game)
			$('.gta-related').toggle(show);
	});
	/* ================================================
	 * characters logic
	 * ===============================================*/
	var characterApbIndex = 0;

	// on adding character
	$(document).on('click', '.characters-apb .characters-add-apb', function (e) {
		app.parseAndTranslate('partials/apb-character', {
			characterApbIndex: ++characterApbIndex
		}, function (html) {
			$('.characters-apb .characters').append(html);
		});
	});

	// on adding screenshot
	$(document).on('click', '.character-apb-screenshot-placeholder', function (e) {
		var el = $(e.target),
			characterIndex = el.attr('data-character-index') || el.closest('[data-character-index]').attr('data-character-index');
		$('#character-apb-screenshot-stats-input-' + characterIndex).trigger('click');
	});

	require(['csrf'], function (csrf) {
		// on uploading screenshot
		$(document).on('change', '.character-apb-screenshot-stats-input', function (e) {
			var el = $(e.target),
				form = el.closest('form');
			console.log('form', form);

			var files = (el.get(0).files.length > 0 && el.get(0).files) || (el.val() ? [{
				name: el.val(),
				type: utils.fileMimeType(el.val())
			}] : null);

			var image = el.get(0).files[0],
				isImage = !!image.type.match(/image./);
			console.log('input changed, files: ', files);
			console.log('isImage and image', isImage, image);

			if (image.size > parseInt(config.maximumFileSize, 10) * 1024) {
				form.get(0).reset();
				return app.alertError('[[error:file-too-big, ' + config.maximumFileSize + ']]');
			}

			form.off('submit').submit(function () {
				$(this).ajaxSubmit({
					headers: {
						'x-csrf-token': csrf.get()
					},
					resetForm: true,
					clearForm: true,
					// formData: params.formData,
					error: onUploadError,
					uploadProgress: function (event, position, total, percent) {
						translator.translate('[[modules:composer.uploading, ' + percent + '%]]', function (translated) {
							for (var i = 0; i < files.length; ++i) {
								console.log(translated);
							}
						});
					},
					success: function (uploads) {
						uploads = maybeParse(uploads);
						if (uploads && uploads.length) {
							for (var i = 0; i < uploads.length; ++i) {
								console.log('uploads', uploads);
							}
						}
					},
					complete: function () {
						form.get(0).reset();
					}
				});
				return false;
			});
			form.submit();
		});
	});

	function onUploadError(xhr) {
		xhr = maybeParse(xhr);
		app.alertError(xhr.responseText);
	}

	function maybeParse(response) {
		if (typeof response === 'string') {
			try {
				return $.parseJSON(response);
			} catch (e) {
				return {
					status: 500,
					message: 'Something went wrong while parsing server response'
				};
			}
		}
		return response;
	}

	// on removing character
	$(document).on('click', '.characters-apb .characters-remove-apb', function (e) {
		var el = $(e.target);
		$('#character-apb-' + el.attr('data-character-index')).remove();
	});

	/* ================================================
	 * Testing
	 * ===============================================*/
	$('#i-play-apb').trigger('click');

});
