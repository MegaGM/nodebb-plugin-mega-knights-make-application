"use strict";
var req,
	res,
	fs = require('fs'),
	path = require('path'),
	async = require.main.require('async'),
	nconf = require.main.require('nconf'),
	db = require.main.require('./src/database/redis'),
	middleware = require.main.require('./src/middleware'),
	plugins = require.main.require('./src/plugins'),
	posts = require.main.require('./src/posts'),
	topics = require.main.require('./src/topics'),
	templates = require.main.require('templates.js'),
	privileges = require.main.require('./src/privileges'),
	nbbHelpers = require.main.require('./src/controllers/helpers'),
	data = {
		title: 'Создать заявку',
		breadcrumbs: nbbHelpers.buildBreadcrumbs([{}])
	},
	validation = require('../client/js/validation.js');
// newsTemplate = fs.readFileSync(path.join(__dirname, '../templates/partials/news.tpl')).toString();

var Block = {
	data: {
		statutePid: '2'
	}
};

var getStatute = function (callback) {
	posts.getPostData(Block.data.statutePid, function (err, statuteRaw) {
		if (err) return callback(err);

		plugins.fireHook('filter:parse.raw', statuteRaw.content, function (err, statuteParsed) {
			callback(err, statuteParsed);
		});
	});
};

Block.getApplicationPage = function (req, res, next) {
	getStatute(function (err, results) {
		if (err) return next(err);

		Block.data.statute = results.statute;
		res.render('make-application', Block.data);
	});
};

Block.postApplicationPage = function (req, res, next) {
	return res.status(200).json({
		template: {
			name: 'make-application',
			'make-application': true
		}
	});
};

module.exports = Block;
