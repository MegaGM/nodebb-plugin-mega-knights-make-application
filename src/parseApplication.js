'use strict';
let config = require('./config'),
	_ = require('lodash'),
	jwt = require('jsonwebtoken'),
	Promise = require('bluebird'),
	async = require.main.require('async'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	validation = require('../client/js/validation');

let Handlebars = require('handlebars');
require('../client/templates');

/* ================================================
 * plugin for parsing application BBcode
 * ===============================================*/
function parseApplication(payload, callback) {
	if (!payload || !payload.postData || !payload.postData.content)
		return callback(null, payload);

	var match,
		content = payload.postData.content;
	if (!(match = content.match(config.tokenBBcodeRegexp)))
		return callback(null, payload);

	try {
		var token = jwt.verify(match[1], config.jwtSecret);
	} catch (e) {
		return callback(null, payload);
	}

	if (!token || token.tid != payload.postData.tid)
		return callback(null, payload);

	/* ================================================
	 * Promisify
	 * ===============================================*/
	let dbGetObject = Promise.promisify(db.getObject);

	Promise.join(
			dbGetObject(config.redisKey + token.tid + ':application'),
			dbGetObject(config.redisKey + token.tid + ':status'),
			(areas, status) => {
				let personal = Handlebars.partials['personal-related']({
					areas
				});

				let chars = getCharsHtmlFromAreas({
					areas,
					token
				}).join('\n');

				let related = Handlebars.partials[token.game + '-related']({
					areas,
					chars
				});

				status = Handlebars.partials['application-status']({
					status,
					token
				});

				let output = Handlebars.templates['application-form-topic']({
					status,
					personal,
					related
				});

				return output;
			})
		.then(output => {
			payload.postData.content = content.replace(config.tokenBBcodeRegexp, output);
			callback(null, payload);
		});
}

function getCharsHtmlFromAreas(data) {
	let areas = data.areas,
		token = data.token;
	return _(areas)
		.map((value, key) => {
			let matchChar = key.match(config.gameCharRegexp);
			if (matchChar) return matchChar[2];
			return false;
		})
		.compact()
		.uniq()
		.sortBy(charI => charI)
		.map(charI => {
			let char = {};
			char['charI'] = charI;

			_.each(areas, (value, key) => {
				if (-1 === key.indexOf(token.game + '-char-' + charI))
					return;

				char[key.replace(/\-\d+/i, '')] = value;
				return;
			});

			return char;
		})
		.map(char => {
			return Handlebars.partials['characters/' + token.game]({
				char,
				charI: char.charI
			});
		})
		.value();
}

module.exports = parseApplication;
