'use strict';
var config = require('./config'),
	jwt = require('jsonwebtoken'),
	async = require.main.require('async'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	posts = require.main.require('./src/posts'),
	topics = require.main.require('./src/topics'),
	user = require.main.require('./src/user'),
	temp = {
		choosenGames: [],
		newTopics: {},
		username: ''
	},
	validator = require('validator'),
	validation = require('../client/js/validation.js');

/* ================================================
 * POST
 * ===============================================*/
var validateAreas = function (req, callback) {
	validation.validateAreas(validator, req.body.areas, function (errors) {
		callback(errors.noErrors ? null : 'validation');
	});
};

var getUserInfo = function (req, callback) {
	temp.username = '';
	user.getUserField(req.uid, 'username', function (err, username) {
		temp.username = username;
		callback(err);
	});
};

var findOutChoosenGames = function (req, callback) {
	temp.choosenGames = [];
	async.each(req.body.areas, function (item, callback) {
		var match;
		if (!(match = item.id.match(config.gameCheckboxRegexp)))
			return callback(null);
		if (item.value)
			temp.choosenGames.push(match[1]);
		callback(null);
	}, callback);
};

var createTopics = function (req, callback) {
	temp.newTopics = {};
	async.each(temp.choosenGames, function (choosenGame, callback) {
		var topicData = {
			// monkey patch to decieve NodeBB privilegies check
			uid: 1,
			// it will be reverted back to realUID in filter:parse.post hook
			realUID: req.uid,
			cid: config.gameCids[choosenGame],
			title: 'Заявка на вступление от ' + temp.username,
			content: 'make-application placeholder',
			tags: [choosenGame, 'Заявка'],
			timestamp: Date.now()
		};

		topics.post(topicData, function (err, createdTopicData) {
			temp.newTopics[choosenGame] = createdTopicData.topicData;
			callback(err);
		});
	}, callback);
};

var saveApplications = function (req, callback) {
	async.each(temp.choosenGames, function (choosenGame, callback) {
		var topicData = temp.newTopics[choosenGame],
			gameAreas = {};

		async.each(req.body.areas, function (item, callback) {
			// skip if it's a char related to another game or it's game choosing checkbox
			var matchChar = item.id.match(config.gameCharRegexp),
				matchCheckbox = item.id.match(config.gameCheckboxRegexp);
			if (matchChar && matchChar[1] !== choosenGame ||
				matchCheckbox && matchCheckbox[1] !== choosenGame)
				return callback(null);

			gameAreas[item.id] = item.value;
			callback(null);
		}, function (err, results) {
			db.setObject(config.redisKey + topicData.tid, gameAreas, callback);
		});

	}, callback);
};

var editPosts = function (req, callback) {
	async.each(temp.choosenGames, function (choosenGame, callback) {
		var topicData = temp.newTopics[choosenGame],
			token = jwt.sign({
				tid: topicData.tid,
				pid: topicData.mainPid,
				uid: req.uid,
				game: choosenGame
			}, config.jwtSecret),
			tokenBBcode = '[application-hash=@' + token + '@]';

		posts.setPostField(topicData.mainPid, 'content', tokenBBcode, callback);
	}, callback);
};

function postApplicationPage(req, res, next) {
	console.log('postApplicationPage req.body.areas', req.body.areas);
	if (!req.uid)
		return res.status(403).json('403 Not authorized');

	if (!req.body.areas || !req.body.areas.length)
		return res.status(400).json('400 Data Process Error: there-is-no-areas');

	groups.isMember(req.uid, 'Рыцари', function (err, isMember) {
		// if user is in Knights forumgroup tell him go away
		if (isMember)
			return res.status(403).json('403 Not authorized: Функционал подачи заявок Рыцарями пока не завершен');

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

			// send info for redirecting
			var tidUrls = [];

			Object.keys(temp.newTopics)
				.forEach(function (key) {
					var newTopic = temp.newTopics[key];
					tidUrls.push('/topic/' + newTopic.tid);
				});
			res.status(200).json({
				tidUrls: tidUrls
			});
		});

	});

};

module.exports = postApplicationPage;
