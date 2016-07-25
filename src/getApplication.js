'use strict';
let config = require('./config'),
	Promise = require('bluebird'),
	posts = require.main.require('./src/posts'),
	plugins = require.main.require('./src/plugins');

let Handlebars = require('handlebars');
require('../client/templates');

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

function parsePartial(partial, _data) {
	let data = _data || {};
	return new Promise((resolve, reject) => {
		let html = Handlebars.partials[partial](data);
		resolve(html);
	});
}

function getApplicationPage(req, res, next) {
	let templateData = {
		apb: {
			gameCid: config.gameCids.apb
		},
		bns: {
			gameCid: config.gameCids.bns
		},
		gta: {
			gameCid: config.gameCids.gta
		}
	};

	Promise.join(
			getStatute(),
			parsePartial('personal-related'),
			parsePartial('apb-related', templateData.apb),
			parsePartial('bns-related', templateData.bns),
			parsePartial('gta-related', templateData.gta),
			(statuteParsed, personal, apb, bns, gta) => {
				res.render('make-application', {
					title: config.title,
					breadcrumbs: config.breadcrumbs,
					statute: statuteParsed,
					personalRelated: personal,
					apbRelated: apb,
					bnsRelated: bns,
					gtaRelated: gta
				});
			})
		.catch(err => next(err));

}

module.exports = getApplicationPage;
