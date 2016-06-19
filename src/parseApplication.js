'use strict';
var config = require('./config'),
	jwt = require('jsonwebtoken'),
	db = require.main.require('./src/database/redis'),
	templates = require.main.require('templates.js'),
	gameTemplates = require('./gameTemplates');

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

	if (!token)
		return callback(null, payload);

	db.getObject(config.redisKey + token.tid, function (err, areas) {
		templates.parse(gameTemplates[token.game], {
			areas: areas
		}, function (html) {
			payload.postData.content = content.replace(config.tokenBBcodeRegexp, html);
			callback(null, payload);
		});
	});
}

module.exports = parseApplication;
