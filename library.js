(function () {
	"use strict";

	/* ---------------------------------------------
	 * require dependencies
	 * ---------------------------------------------*/
	var async = require.main.require('async'),
		application = require('./src/application'),
		nconf = require.main.require('nconf'),
		ensureLoggedIn = require.main.require('connect-ensure-login'),
		nbbHelpers = require.main.require('./src/controllers/helpers'),
		data = {
			title: 'Создать заявку',
			breadcrumbs: nbbHelpers.buildBreadcrumbs([{}])
		};

	/* ---------------------------------------------
	 * declare routes
	 * ---------------------------------------------*/
	var render = {
		testing: function (req, res, next) {
			console.log('testing route req.files', req.files);
			console.log('testing route req', req);
			res.status(200).json({okay: 'fine'});
		},
		application: function (req, res, next) {
			application.getApplicationPage(req, res, function (err, data) {
				// console.log('getApplicationPage data: ', data);
				res.render('application', data);
			});
			// console.log('application middleware!!');
			if (res.locals.isAPI) {
				// console.log('application middleware isAPI!!!');
			}
		}
	};

	var Plugin = {
		init: function (params, callback) {
			params.router.post('/api/testing',
				render.testing);
			/* ---------------------------------------------
			 * setup routes
			 * ---------------------------------------------*/
			params.router.get('/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				params.middleware.buildHeader,
				render.application);

			params.router.get('/api/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				render.application);

			callback(null);
		},
		admin: function (header, callback) {
			header.plugins.push({
				route: '/plugins/start',
				icon: 'fa-paint-brush',
				name: 'Startpage'
			});

			callback(null, header);
		}
	};

	module.exports = Plugin;
})();
