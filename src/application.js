"use strict";
var req,
	res,
	fs = require('fs'),
	path = require('path'),
	async = require.main.require('async'),
	nconf = require.main.require('nconf'),
	db = require.main.require('./src/database/redis'),
	middleware = require.main.require('./src/middleware'),
	posts = require.main.require('./src/posts'),
	topics = require.main.require('./src/topics'),
	templates = require.main.require('templates.js'),
	privileges = require.main.require('./src/privileges');
// newsTemplate = fs.readFileSync(path.join(__dirname, '../templates/partials/news.tpl')).toString();

var Block = {
	data: {
		statutePid: '2',
		topicTags: []
	}
};

var getTopicsTagsAndReadState = function (callback) {
	//meow
};

var getStatute = function (callback) {
	callback();
};

//topics.hasReadTopics(tids, uid, callback)
Block.getApplicationPage = function (_req, _res, callback) {
	req = _req;
	res = _res;
	async.parallel({
		getStatute: getStatute
	}, function (err, results) {
		callback(err, {meow: 'aw'});
		// templates.parse(newsTemplate, {
		// 	news: Block.data.topics,
		// 	config: {
		// 		relative_path: nconf.get('relative_path')
		// 	}
		// }, function (html) {
		// 	callback(err, html);
		// });
	});
};

module.exports = Block;
