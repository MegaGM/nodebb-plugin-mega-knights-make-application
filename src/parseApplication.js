"use strict";
var fs = require('fs'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	db = require.main.require('./src/database/redis'),
	templates = require.main.require('templates.js'),
	data = {
		tokenBBcodeRegexp: /\[application-hash\=\@([^"]+)\@\]/i,
		redisKey: 'mega:applications:',
		jwtSecret: 'megasecretkeyboardcatlolmeow',
		username: ''
	},
	gameTemplates = {
		apb: fs.readFileSync(path.join(__dirname, '../templates/partials/apb-related.tpl')).toString()
			// bns: fs.readFileSync(path.join(__dirname, '../templates/partials/application-template.tpl')).toString(),
			// gta: fs.readFileSync(path.join(__dirname, '../templates/partials/application-template.tpl')).toString()
	};

function parseApplication(payload, callback) {
	if (!payload || !payload.postData || !payload.postData.content)
		return callback(null, payload);

	var match,
		content = payload.postData.content;
	if (!(match = content.match(data.tokenBBcodeRegexp)))
		return callback(null, payload);

	try {
		var token = jwt.verify(match[1], data.jwtSecret);
	} catch (e) {
		return callback(null, payload);
	}

	if (!token)
		return callback(null, payload);

	db.getObject(data.redisKey + token.tid, function (err, areas) {
		templates.parse(gameTemplates[token.game], {
			areas: areas
		}, function (html) {
			payload.postData.content = content.replace(data.tokenBBcodeRegexp, html);
			callback(null, payload);
		});
	});
}

module.exports = parseApplication;
