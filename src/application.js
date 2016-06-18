"use strict";
var req,
	res,
	fs = require('fs'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	async = require.main.require('async'),
	nconf = require.main.require('nconf'),
	db = require.main.require('./src/database/redis'),
	middleware = require.main.require('./src/middleware'),
	nbbHelpers = require.main.require('./src/controllers/helpers'),
	plugins = require.main.require('./src/plugins'),
	posts = require.main.require('./src/posts'),
	privileges = require.main.require('./src/privileges'),
	topics = require.main.require('./src/topics'),
	templates = require.main.require('templates.js'),
	user = require.main.require('./src/user'),
	data = {
		title: 'Создать заявку',
		breadcrumbs: nbbHelpers.buildBreadcrumbs([{}]),
		statutePid: '2',
		gameCids: {
			apb: 14,
			bns: 22,
			gta: 9
		},
		gameCheckboxRegexp: /i-choose-(\w{3})/i,
		gameCharRegexp: /(\w{3})-char-/i,
		tokenBBcodeRegexp: /\[application-hash\=\@([^"]+)\@\]/i,
		choosenGames: [],
		newTopics: {},
		redisKey: 'mega:applications:',
		jwtSecret: 'megasecretkeyboardcatlolmeow',
		username: ''
	},
	validator = require('validator'),
	validation = require('../client/js/validation.js'),
	applicationTemplate = fs.readFileSync(path.join(__dirname, '../templates/partials/application-template.tpl')).toString();

var Block = {};

/* ================================================
 * GET
 * ===============================================*/
var getStatute = function (callback) {
	posts.getPostData(data.statutePid, function (err, statuteRaw) {
		if (err) return callback(err);

		plugins.fireHook('filter:parse.raw', statuteRaw.content, function (err, statuteParsed) {
			callback(err, statuteParsed);
		});
	});
};

Block.getApplicationPage = function (req, res, next) {
	getStatute(function (err, results) {
		if (err) return next(err);

		res.render('make-application', {
			statute: results.statute
		});
	});
};

/* ================================================
 * POST
 * ===============================================*/
var validateAreas = function (req, callback) {
	validation.validateAreas(validator, req.body.areas, function (errors) {
		console.log('\n\n\nErrors validation', errors);
		// TODO: stub
		return callback(null);
		// callback(errors.noErrors ? null : 'validation');
	});
};

var getUserInfo = function (req, callback) {
	user.getUserField(req.uid, 'username', function (err, username) {
		data.username = username;
		callback(err);
	});
};

var findOutChoosenGames = function (req, callback) {
	async.each(req.body.areas, function (item, callback) {
		var match;
		if (!(match = item.id.match(data.gameCheckboxRegexp)))
			return callback(null);
		if (item.value)
			data.choosenGames.push(match[1]);
		callback(null);
	}, callback);
};

var createTopics = function (req, callback) {
	async.each(data.choosenGames, function (choosenGame, callback) {
		var topicData = {
			uid: 1,
			realUID: req.uid,
			cid: data.gameCids[choosenGame],
			title: 'Заявка на вступление от ' + data.username,
			content: 'make-application placeholder',
			tags: [choosenGame, 'Заявка'],
			timestamp: Date.now()
		};

		topics.post(topicData, function (err, createdTopicData) {
			// data.newTopics.push(createdTopicData.topicData);
			data.newTopics[choosenGame] = createdTopicData.topicData;
			callback(err);
		});
	}, callback);
};

var saveApplications = function (req, callback) {
	async.each(data.choosenGames, function (choosenGame, callback) {
		var topicData = data.newTopics[choosenGame],
			gameAreas = {};

		async.each(req.body.areas, function (item, callback) {
			// skip if it's char related to another game or it's game choose checkbox
			var matchChar = item.id.match(data.gameCharRegexp),
				matchCheckbox = item.id.match(data.gameCheckboxRegexp);
			if (matchChar && matchChar[1] !== choosenGame ||
				matchCheckbox && matchCheckbox[1] !== choosenGame)
				return callback(null);

			gameAreas[item.id] = item.value;
			callback(null);
		}, function (err, results) {
			db.setObject(data.redisKey + topicData.tid, gameAreas, callback);
		});

	}, callback);
};

var editPosts = function (req, callback) {
	async.each(data.choosenGames, function (choosenGame, callback) {
		var topicData = data.newTopics[choosenGame],
			token = jwt.sign({
				tid: topicData.tid,
				pid: topicData.mainPid,
				uid: req.uid
			}, data.jwtSecret),
			tokenBBcode = '[application-hash=@' + token + '@]';

		posts.setPostField(topicData.mainPid, 'content', tokenBBcode, callback);
	}, callback);
};

Block.postApplicationPage = function (req, res, next) {
	console.log('postApplicationPage req.body.areas', req.body.areas);

	// TODO: uncomment
	// if (!req.uid)
	// 	return res.status(403).json('403 Not authorized');

	if (!req.body.areas || !req.body.areas.length)
		return res.status(400).json('400 Data Process Error: there-is-no-areas');

	async.series({
		validateAreas: async.apply(validateAreas, req),
		getUserInfo: async.apply(getUserInfo, req),
		findOutChoosenGames: async.apply(findOutChoosenGames, req),
		createTopics: async.apply(createTopics, req),
		saveApplications: async.apply(saveApplications, req),
		editPosts: async.apply(editPosts, req)
	}, function (err, results) {
		if (err) {
			if ('validation' === err)
				return res.status(400).json('400 Data Process Error: not valid data has been recieved from client');
			else
				return next(err);
		}
		// TODO: callback
		console.log('finish of series in application');
	});
};

Block.parseApplication = function (payload, callback) {
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
		templates.parse(applicationTemplate, {
			areas: areas,
			config: {
				relative_path: nconf.get('relative_path')
			}
		}, function (html) {
			payload.postData.content = content.replace(data.tokenBBcodeRegexp, html);
			callback(null, payload);
		});
	});
};

module.exports = Block;
