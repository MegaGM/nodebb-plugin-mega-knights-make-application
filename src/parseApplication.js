'use strict';
let config = require('./config'),
	_ = require('lodash'),
	jwt = require('jsonwebtoken'),
	Promise = require('bluebird'),
	async = require.main.require('async'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	templates = require.main.require('templates.js'),
	validation = require('../client/js/validation'),
	applicationPartials = require('./applicationPartials');

/* ================================================
 * plugin for parsing application BBcode
 * ===============================================*/
templates.registerHelper('woProtocol', function (str) {
	return str ? str.replace(/^https?\:\/\//i, '') : 'nothing!';
});

function parseTemplate(template, data) {
	return new Promise((resolve, reject) => {
		templates.parse(template, data, function (html) {
			resolve(html);
		});
	});
}

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

	// TODO: realise filter for sensitive info based on req.uid's Рыцари group membership

	let dbGetObject = Promise.promisify(db.getObject);

	dbGetObject(config.redisKey + token.tid)
		.then(areas => {
			_.each(Object.keys(areas), function (key) {
				let area = areas[key];
				if ('string' == typeof area && area.match(/^https?\:\/\//i))
					areas[key + '-parsed'] = area.substring(area.lastIndexOf('/') + 1);
			});
			return {
				areas: areas
			}
		})
		.then(areas => {
			return [
				parseTemplate(applicationPartials['personal'], areas),
				parseTemplate(applicationPartials[token.game], areas)
			];
		}).spread((personal, game) => {
			payload.postData.content = content
				.replace(config.tokenBBcodeRegexp, personal + ' ' + game);
			callback(null, payload);
		});
}

module.exports = parseApplication;
