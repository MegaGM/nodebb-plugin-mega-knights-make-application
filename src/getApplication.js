"use strict";
var req,
	res,
	fs = require('fs'),
	path = require('path'),
	jwt = require('jsonwebtoken'),
	Promise = require('bluebird'),
	async = require.main.require('async'),
	nconf = require.main.require('nconf'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
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
	gameTemplates = {
		apb: fs.readFileSync(path.join(__dirname, '../templates/partials/apb-related.tpl')).toString(),
		bns: fs.readFileSync(path.join(__dirname, '../templates/partials/apb-related.tpl')).toString(),
		gta: fs.readFileSync(path.join(__dirname, '../templates/partials/apb-related.tpl')).toString()
			// bns: fs.readFileSync(path.join(__dirname, '../templates/partials/application-template.tpl')).toString(),
			// gta: fs.readFileSync(path.join(__dirname, '../templates/partials/application-template.tpl')).toString()
	};

var Block = {};

/* ================================================
 * GET
 * ===============================================*/
function getStatute() {
	return new Promise((resolve, reject) => {
		posts.getPostData(data.statutePid, function (err, statuteRaw) {
			if (err) return reject(err);

			plugins.fireHook('filter:parse.raw', statuteRaw.content, function (err, statuteParsed) {
				if (err) return reject(err);
				resolve(statuteParsed);
			});
		});
	});
}

function parseTemplate(game) {
	return new Promise((resolve, reject) => {
		templates.parse(gameTemplates[game], {}, function (html) {
			resolve(html);
		});
	});
}

function getApplicationPage(req, res, next) {
	Promise.all([
			getStatute(),
			parseTemplate('apb'),
			parseTemplate('bns'),
			parseTemplate('gta')
		])
		.then(results => {
			res.render('make-application', {
				statute: results[0],
				apbRelated: results[1],
				bnsRelated: results[2],
				gtaRelated: results[3]
			});
		})
		.catch(err => next(err));

}

module.exports = getApplicationPage;
