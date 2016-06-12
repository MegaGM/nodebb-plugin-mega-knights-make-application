$(document).on('ready', function (e) {
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
});
