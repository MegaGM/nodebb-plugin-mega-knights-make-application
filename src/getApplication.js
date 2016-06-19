'use strict';
var config = require('./config'),
	Promise = require('bluebird'),
	posts = require.main.require('./src/posts'),
	plugins = require.main.require('./src/plugins'),
	templates = require.main.require('templates.js'),
	gameTemplates = require('./gameTemplates');

/* ================================================
 * GET
 * ===============================================*/
function getStatute() {
	return new Promise((resolve, reject) => {
		posts.getPostData(config.statutePid, function (err, statuteRaw) {
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
				title: config.title,
				breadcrumbs: config.breadcrumbs,
				statute: results[0],
				apbRelated: results[1],
				bnsRelated: results[2],
				gtaRelated: results[3]
			});
		})
		.catch(err => next(err));

}

module.exports = getApplicationPage;
