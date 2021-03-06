(function (define) {
	define(function (require, exports, module) {

		var rules = {
			'i-choose-apb': {
				required: false
			},
			'i-choose-bns': {
				required: false
			},
			'i-choose-gta': {
				required: false
			},
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
					max: 50
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
				'required': false,
				'length': {
					min: 6,
					max: 32
				}
			},
			'contact-vk': {
				'required': false,
				'sensitive': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['vk.com', 'm.vk.com']
				}
			},
			'contact-steam': {
				'required': false,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['steamcommunity.com']
				}
			},
			'contact-social-club': {
				'required': false,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['socialclub.rockstargames.com', 'ru.socialclub.rockstargames.com']
				}
			},
			'contact-4game': {
				'required': false,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['4gameforum.com']
				}
			},
			'contact-gamersfirst': {
				'required': false,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['uploads.forums.gamersfirst.com']
				}
			},
			'apb-previous-clans': {
				'required': false,
				'length': {
					min: 3,
					max: 100
				}
			},
			'apb-leave-reasons': {
				'required': false,
				'length': {
					min: 3,
					max: 1024
				}
			},
			'apb-char-nickname': {
				'required': true,
				'length': {
					min: 3,
					max: 40
				}
			},
			'apb-char-renames': {
				'required': false,
				'sensitive': true,
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
			'apb-screenshot-url-lobby': {
				'required': true,
				'sensitive': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['imgur.com', 'i.imgur.com']
				},
				'length': {
					min: 20,
					max: 100
				}
			},
			'apb-char-screenshot-url-charstats': {
				'required': true,
				'sensitive': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['imgur.com', 'i.imgur.com']
				},
				'length': {
					min: 20,
					max: 100
				}
			},
			'bns-expirience': {
				'required': false,
				'length': {
					min: 3,
					max: 512
				}
			},
			'bns-fps': {
				'required': true
			},
			'bns-i-play-pvp': {
				required: false
			},
			'bns-i-play-pve': {
				required: false
			},
			'bns-i-play-morning': {
				required: false
			},
			'bns-i-play-day': {
				required: false
			},
			'bns-i-play-evening': {
				required: false
			},
			'bns-i-play-night': {
				required: false
			},
			'bns-previous-clans': {
				required: false,
				'length': {
					min: 3,
					max: 100
				}
			},
			'bns-leave-reasons': {
				required: false,
				'length': {
					min: 3,
					max: 1024
				}
			},
			'bns-char-nickname': {
				'required': true,
				'length': {
					min: 3,
					max: 40
				}
			},
			'bns-char-renames': {
				'required': false,
				'sensitive': true,
				'length': {
					min: 3,
					max: 40
				}
			},
			'bns-char-server': {
				'required': true
			},
			'bns-char-faction': {
				'required': true
			},
			'bns-char-level': {
				'required': true
			},
			'bns-screenshot-url-lobby': {
				'required': true,
				'sensitive': true,
				'url': {
					'protocols': ['http', 'https'],
					'allow_underscores': true,
					'host_whitelist': ['imgur.com', 'i.imgur.com']
				},
				'length': {
					min: 20,
					max: 100
				}
			},
			'bns-char-screenshot-url-charstats': {
				'required': true,
				'sensitive': true,
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

		function getRuleName(originalId) {
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

				// skip if NOT required && is empty || is a checkbox
				if (!rules[item.rule].required) {
					if ('checkbox' === item.type || null === item.value || '' === item.value)
						return;
				}

				errors[item.id] = [];

				if ('select-one' === item.type) {
					var notSelected = 'not-selected' === item.value;

					if (notSelected) {
						var labelText = '';
						if (typeof void 0 !== typeof window && window.$)
							labelText = $('label[for="' + item.id + '"]').text();

						errors[item.id].push('Не выбрано значение: ' + labelText);
						errors.noErrors = false;
						return;
					}
				}

				if ('text' === item.type || 'textarea' === item.type) {
					var valueIsEmpty = !validator.trim(item.value).length;

					// if input is required but it's empty
					if (valueIsEmpty) {
						var labelText = '';
						if (typeof void 0 !== typeof window && window.$)
							labelText = $('label[for="' + item.id + '"]').text();

						errors[item.id].push('Не заполнено поле: ' + labelText);
						errors.noErrors = false;
						return;
					}

					if (rules[item.rule].length) {
						var lengthIsIncorrect = !validator.isLength(validator.trim(item.value), rules[item.rule].length);

						if (lengthIsIncorrect) {
							var labelText = '';
							if (typeof void 0 !== typeof window && window.$)
								labelText = $('label[for="' + item.id + '"]').text();

							errors[item.id].push('Недопустимая длина для значения: ' + labelText + '\nДопустимая от ' + rules[item.rule].length.min + ' до ' + rules[item.rule].length.max);
							errors.noErrors = false;
							return;
						}
					}

					// check if a url is a valid one
					if (rules[item.rule].url) {
						var valueIsNotURL = !validator.isURL(validator.trim(item.value), rules[item.rule].url);

						if (valueIsNotURL) {
							var labelText = '';
							if (typeof void 0 !== typeof window && window.$)
								labelText = $('label[for="' + item.id + '"]').text();

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
			getRuleName: getRuleName,
			validateAreas: validateAreas
		};
	});
}(typeof module === 'object' && module.exports && typeof define !== 'function' ?
	function (F) {
		module.exports = F(require, exports, module);
	} : define
));
