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

	// TODO: make a filter for sensitive info based on req.uid's Рыцари group membership

	let dbGetObject = Promise.promisify(db.getObject);

	dbGetObject(config.redisKey + token.tid + ':application')
		.then(areas => {
			let personal = Handlebars.partials['personal-related']({
				areas: areas
			});

			let chars = getCharsHtmlFromAreas({
				areas: areas,
				token: token
			}).join('\n');

			chars = Handlebars.partials['characters/' + token.game + '-charlist']({
				chars: chars
			});

			let output = Handlebars.templates['application-form-topic']({
				personal: personal,
				chars: chars
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
				charI: char.charI,
				char: char
			});
		})
		.value();
}

module.exports = parseApplication;
