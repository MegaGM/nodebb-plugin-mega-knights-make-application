(function (define) {
	define(function (require, exports, module) {

		var rules = {
			'personal-firstname': {
				'required': true,
				'length': {
					min: 2,
					max: 40
				}
			},
			'personal-age': {
				'required': true
			},
			'personal-location': {
				'required': true,
				'length': {
					min: 3,
					max: 100
				}
			},
			'personal-aboutme': {
				'required': true,
				'length': {
					min: 3,
					max: 1024
				}
			},
			'contact-skype': {
				'required': true,
				'length': {
					min: 6,
					max: 32
				}
			},
			'contact-vk': {
				'required': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['vk.com', 'm.vk.com']
				},
				'length': {
					min: 8,
					max: 100
				}
			},
			'apb-previous-clans': {
				'required': false
			},
			'apb-leave-reasons': {
				'required': false
			},
			'apb-char-nickname': {
				'required': true,
				'length': {
					min: 3,
					max: 40
				}
			},
			'apb-char-server': {
				'required': true
			},
			'apb-char-faction': {
				'required': true
			},
			'apb-char-threat': {
				'required': true
			},
			'apb-char-level': {
				'required': true
			},
			'apb-char-screenshot-url-charstats': {
				'required': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['imgur.com', 'i.imgur.com']
				},
				'length': {
					min: 20,
					max: 100
				}
			}
		};

		var getRule = function (originalId) {
			if (!originalId || '' === originalId)
				return false;
			// gracefully remove charIndex from id if present
			if (originalId.match(/\w{3}\-char\-\d+\-.+/i))
				return originalId.replace(/(\w{3}\-char\-)\d+\-(.+)/i, '$1$2');
			else
				return originalId;
		}

		var validateAreas = function (validator, areas, callback) {
			var errors = {
				noErrors: true
			};
			// perform actual checking of the inputs
			areas.forEach(function (item) {
				if (!rules[item.rule].required) return;
				errors[item.id] = [];

				if ('select-one' === item.type) {
					var notSelected = 'not-selected' === item.value;

					if (notSelected) {
						var labelText = $('label[for="' + item.id + '"]').text();
						errors[item.id].push('Не выбрано значение: ' + labelText);
						errors.noErrors = false;
						return;
					}
				}

				if ('text' === item.type || 'textarea' === item.type) {
					var valueIsEmpty = !validator.trim(item.value).length;

					// if input is required but it's empty
					if (valueIsEmpty) {
						var labelText = $('label[for="' + item.id + '"]').text();
						errors[item.id].push('Не заполнено поле: ' + labelText);
						errors.noErrors = false;
						return;
					}

					if (rules[item.rule].length) {
						var lengthIsIncorrect = !validator.isLength(validator.trim(item.value), rules[item.rule].length);

						if (lengthIsIncorrect) {
							var labelText = $('label[for="' + item.id + '"]').text();
							errors[item.id].push('Недопустимая длина для значения: ' + labelText + '\nДопустимая от ' + rules[item.rule].length.min + ' до ' + rules[item.rule].length.max);
							errors.noErrors = false;
							return;
						}
					}

					// check if a url is a valid one
					if (rules[item.rule].url) {
						var valueIsNotURL = !validator.isURL(validator.trim(item.value), rules[item.rule].url);

						if (valueIsNotURL) {
							var labelText = $('label[for="' + item.id + '"]').text();
							errors[item.id].push('Недопустимое значение в: ' + labelText);
							errors.noErrors = false;
							return;
						}
					}
				}
			});

			callback(errors);
		};
		return {
			rules: rules,
			getRule: getRule,
			validateAreas: validateAreas
		};
	});
}(typeof module === 'object' && module.exports && typeof define !== 'function' ?
	function (F) {
		module.exports = F(require, exports, module);
	} : define
));
