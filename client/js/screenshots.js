$(document).on('ready', function (e) {
	/* ================================================
	 * characters logic
	 * ===============================================*/
	// on adding screenshot
	$(document).on('click', '.application-form-layout .screenshot-placeholder', function (e) {
		var el = $(e.target);
		el.find('.screenshot-fileinput').trigger('click');
	});

	// on uploading screenshot
	require(['csrf'], function (csrf) {
		$(document).on('change', '.application-form-layout .screenshot-fileinput', function (e) {
			var el = $(e.target),
				form = el.closest('form'),
				placeholder = el.closest('.screenshot-placeholder'),
				characterIndex = el.closest('.char').attr('data-char-index');

			var files = (el.get(0).files.length > 0 && el.get(0).files) ||
				(el.val() ? [{
					name: el.val(),
					type: utils.fileMimeType(el.val())
				}] : null);

			if (!files || !files.length) {
				placeholder
					.css('background-image', 'none')
					.removeClass('no-border');
				placeholder.find('.icon').show();
				placeholder.find('.screenshot-url').val('');
				return false;
			}

			var image = el.get(0).files[0],
				isImage = !!image.type.match(/image./);

			if (!isImage) {
				form.get(0).reset();
				return app.alertError('[[error:invalid-file-type, .jpg, .png, .gif, .bmp]]')
			}

			if (image.size > parseInt(config.maximumFileSize, 10) * 1024) {
				form.get(0).reset();
				return app.alertError('[[error:file-too-big, ' + config.maximumFileSize + ']]');
			}

			form.off('submit').submit(function () {
				// setup spinner to indicate upload progress
				placeholder.find('.icon')
					.removeClass('fa-cloud-upload')
					.addClass('fa-spinner fa-spin');

				$(this).ajaxSubmit({
					headers: {
						'x-csrf-token': csrf.get()
					},
					error: onUploadError,
					success: function (uploads) {
						uploads = maybeParse(uploads);
						// may cause silent errors
						if (!uploads || !uploads.length) return;
						uploads.forEach(function (image) {
							placeholder
								.css('background-image', 'url(' + image.url + ')')
								.addClass('no-border');
							placeholder.find('.icon').hide()
							placeholder.find('.screenshot-url').val(image.url);
						});
					},
					complete: function () {
						placeholder.find('.icon')
							.removeClass('fa-spinner fa-spin')
							.addClass('fa-cloud-upload');
					}
					// resetForm: true
					// clearForm: true
					// formData: params.formData
					// uploadProgress: function (event, position, total, percent) {
					// 	translator.translate('[[modules:composer.uploading, ' + percent + '%]]', function (translated) {
					// 		for (var i = 0; i < files.length; ++i) {
					// 			console.log(translated);
					// 		}
					// 	});
					// }
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
});
