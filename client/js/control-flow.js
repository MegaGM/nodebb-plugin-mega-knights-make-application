$(document).on('ready', function (e) {
	/* ================================================
	 * Testing
	 * ===============================================*/
	// $('#i-choose-apb').trigger('click')

	/* ================================================
	 * startpage redirect button
	 * ===============================================*/
	$(document).on('mousedown', '.make-application-teaser .button', function (e) {
		if (e.which === 3) return false;
		// strange behavior
		// ajaxify.go('/make-application');
		window.location.href = '/make-application';
	});

	/* ================================================
	 * choosing game logic
	 * ===============================================*/
	$(document).on('change', '.choose-game input', function (e) {
		var el = $(e.target),
			game = el.attr('data-game'),
			show = el.prop('checked');

		if ('apb' === game || 'bns' === game || 'gta' === game)
			$('.' + game + '-related').toggle(show);
	});;

	/* ================================================
	 * change input logic?
	 * ===============================================*/
	$(document).on('change', '.application-form-layout input, .application-form-layout select, .application-form-layout textarea', function (e) {
		$(e.target).closest('.form-group').removeClass('has-error');
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
		el.prop('checked') ?
			$('.accept-statute-btn').prop('disabled', false) :
			$('.accept-statute-btn').prop('disabled', true);
	});

	// third step
	$(document).on('click', '.submit-application', function (e) {
		/* ================================================
		 * handler to show errors to client
		 * ===============================================*/
		// remove any errors
		$('.validator-errors').html('');
		$('.has-error').each(function (i, item) {
			$(item).removeClass('has-error');
		});

		var errors = {
			noErrors: true
		};

		function showErrors(errors) {
			Object.keys(errors).forEach(function (key) {
				if (errors[key].length) {
					errors[key].forEach(function (err) {
						$('#' + key).closest('.form-group').addClass('has-error');
						$('.validator-errors').append('<div class="alert alert-danger">' + err + '</div>');
					});
				}
			});
		}

		/* ================================================
		 * Check if games and characters were choosen and created
		 * ===============================================*/
		// check if at least one of the games was choosen
		var gameCheckboxes =
			$('.application-form-layout')
			.find('input[data-game]')
			.filter(function (i, item) {
				return $(item).prop('checked');
			}),
			atLeastOneGameWasChoosen = gameCheckboxes.length;

		if (!atLeastOneGameWasChoosen) {
			errors.noErrors = false;
			// monkey patch to let the function find the right .form-group
			errors['i-choose-apb'] = ['Не выбрана ни одна игра'];
		}

		if (!errors.noErrors) return showErrors(errors);

		// check if at least one character was created for each choosen game
		gameCheckboxes.each(function (i, item) {
			var el = $(item),
				game = el.attr('data-game'),
				gameCharlist = $('.chars[data-game="' + game + '"]').find('.charlist');
			if (!$.trim(gameCharlist.html())) {
				errors.noErrors = false;
				// fake id
				errors['no-chars-in-' + game] = ['Не добавлен ни один персонаж в игре: ' + game];
			}
		});

		if (!errors.noErrors) return showErrors(errors);

		var modulePath = '../../plugins/nodebb-plugin-mega-knights-make-application',
			validatorPath = modulePath + '/js/lib/validator.min.js',
			validationPath = modulePath + '/js/validation.js';

		require([validatorPath, validationPath, 'csrf'], function (validator, validation, csrf) {
			var rules = validation.rules,
				getRule = validation.getRule;

			// find and filter all inputs in application
			var areas = [];
			$('.application-form-layout')
				.find('input, select, textarea')
				.filter(function (i, item) {
					var el = $(item),
						id = getRule(el.prop('id'));
					return !!id ? !!rules[id] : false;
				})
				.each(function (i, item) {
					var el = $(item),
						id = el.prop('id'),
						rule = getRule(id),
						type = el.prop('type'),
						value = ('text' === type || 'textarea' === type || 'select-one' === type) ? el.val() : 'checkbox' === type ? el.prop('checked') : null;

					areas.push({
						id: id,
						rule: rule,
						type: type,
						value: value
					});
				});
			// TODO: remove
			console.log('initial areas', areas);

			validation.validateAreas(validator, areas, function (errors) {
				// TODO: uncomment this
				if (!errors.noErrors) return showErrors(errors);

				$.ajax({
					url: '/make-application',
					type: 'POST',
					contentType: 'application/json; charset=utf-8',
					headers: {
						'x-csrf-token': csrf.get()
					},
					dataType: 'json',
					data: JSON.stringify({
						areas: areas
					}),
					statusCode: {
						400: showNodeBBError,
						403: showNodeBBError,
						500: showNodeBBError
					},
					complete: function (data) {
						// TODO: make success alert
						console.log('complete', data);
					}
				});

				function showNodeBBError(data) {
					data.responseJSON = data.responseJSON ? data.responseJSON : 'Error';
					app.alertError(data.responseJSON);
				}
			});

		});
	});

});
