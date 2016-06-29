'use strict';
let config = require('./config'),
	_ = require('lodash'),
	jwt = require('jsonwebtoken'),
	Promise = require('bluebird'),
	async = require.main.require('async'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	Application = require('./Application'),
	validation = require('../client/js/validation');

let Handlebars = require('handlebars');
require('../client/templates');

/* ================================================
 * plugin for parsing BBcode of an application
 * ===============================================*/
function parseApplication(payload, callback) {
	/* ================================================
	 * Checks
	 * ===============================================*/
	if (!payload || !payload.postData || !payload.postData.content)
		return callback(null, payload);

	let match,
		content = payload.postData.content;
	if (!(match = content.match(config.tokenBBcodeRegexp)))
		return callback(null, payload);

	let token = null;
	try {
		token = jwt.verify(match[1], config.jwtSecret);
	} catch (e) {
		return callback(null, payload);
	}

	if (!token || token.tid != payload.postData.tid)
		return callback(null, payload);

	/* ================================================
	 * Parse templates and replace BBcode with html
	 * ===============================================*/
	let a = new Application(token.tid);
	a.getAreas()
		.then(areas => {
			// render application for topic
			return Handlebars.templates['application-form-topic']({
				summary: Handlebars.partials['application-summary'](),
				personal: Handlebars.partials['personal-related']({
					areas
				}),
				related: Handlebars.partials[token.game + '-related']({
					areas,
					chars: getCharsHtmlFromAreas({
						areas,
						token
					}).join('\n')
				})
			});
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
