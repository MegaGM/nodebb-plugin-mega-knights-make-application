'use strict';
var config = require('./config'),
	Promise = require('bluebird'),
	posts = require.main.require('./src/posts'),
	plugins = require.main.require('./src/plugins'),
	templates = require.main.require('templates.js'),
	applicationPartials = require('./applicationPartials');

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
		templates.parse(applicationPartials[game], {}, function (html) {
			resolve(html);
		});
	});
}

function getApplicationPage(req, res, next) {
	Promise.all([
			getStatute(),
			parseTemplate('personal'),
			parseTemplate('apb'),
			parseTemplate('bns'),
			parseTemplate('gta')
		])
		.then(results => {
			res.render('make-application', {
				title: config.title,
				breadcrumbs: config.breadcrumbs,
				statute: results[0],
				personalRelated: results[1],
				apbRelated: results[2],
				bnsRelated: results[3],
				gtaRelated: results[4]
			});
		})
		.catch(err => next(err));

}

module.exports = getApplicationPage;
