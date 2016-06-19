'use strict';
var config = require('./config'),
	_ = require('lodash'),
	jwt = require('jsonwebtoken'),
	async = require.main.require('async'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	templates = require.main.require('templates.js'),
	validation = require('../client/js/validation'),
	gameTemplates = require('./gameTemplates');

function parseApplication(payload, callback) {
	if (!payload || !payload.postData || !payload.postData.content)
		return callback(null, payload);
	//TODO:remove dubug
	console.log('payload.postData', payload);

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

	var isKnight = false,
		rules = validation.rules,
		getRuleName = validation.getRuleName;
	// FIX: monkey patch for debug
	var req = {
		uid: 1
	};

	async.waterfall([
		async.apply(groups.isMember, req.uid, 'Рыцари'),
		(isMember, callback) => {
			isKnight = isMember;
			return callback(null);
		},
		async.apply(db.getObject, config.redisKey + token.tid),
		(areas, callback) => {
			console.log('areas: ', areas);
			areas = _.filter(areas, function (area) {
				return area.sensitive ? isKnight : true;
			});
			templates.parse(gameTemplates[token.game], {
				areas: areas
			}, function (html) {
				payload.postData.content = content.replace(config.tokenBBcodeRegexp, html);
				callback(null, payload);
			});
		}
	], function (err) {
		callback(null, payload);
	})
}

module.exports = parseApplication;
