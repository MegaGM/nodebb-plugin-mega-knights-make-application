$(document).on('ready', function (e) {
	/* ================================================
	 * characters logic
	 * ===============================================*/
	// on adding screenshot
	$(document).on('click', '.character-apb-screenshot-placeholder', function (e) {
		var el = $(e.target),
			characterIndex = el.attr('data-character-index') || el.closest('[data-character-index]').attr('data-character-index');
		$('#character-apb-screenshot-stats-input-' + characterIndex).trigger('click');
	});

	// on uploading screenshot
	require(['csrf'], function (csrf) {
		$(document).on('change', '.character-apb-screenshot-stats-input', function (e) {
			var el = $(e.target),
				form = el.closest('form'),
				characterIndex = form.attr('data-character-index');

			var files = (el.get(0).files.length > 0 && el.get(0).files) || (el.val() ? [{
				name: el.val(),
				type: utils.fileMimeType(el.val())
			}] : null);
			console.log('characterIndex', characterIndex);
			console.log('form', form);
			console.log('files', files);

			if (!files || !files.length) {
				var placeholder = $('#character-apb-screenshot-placeholder-' + characterIndex);
				placeholder.css('background-image', 'none');
				placeholder.removeClass('no-border');
				placeholder.find('.icon').show();
			}

			var image = el.get(0).files[0],
				isImage = !!image.type.match(/image./);
			console.log('input changed, files: ', files);
			console.log('isImage and image', isImage, image);

			if (!isImage) {
				form.get(0).reset();
				return app.alertError('[[error:invalid-file-type, jpg png gif bmp]]');
			}

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
						if (!uploads || !uploads.length) return;
						uploads.forEach(function (image) {
							var placeholder = $('#character-apb-screenshot-placeholder-' + characterIndex);
							placeholder.css('background-image', 'url(' + image.url + ')');
							placeholder.addClass('no-border');
							placeholder.find('.icon').hide();
							console.log('an image', image);
						});
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
});
