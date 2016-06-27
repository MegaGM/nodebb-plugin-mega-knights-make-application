(function () {
	'use strict';

	/* ---------------------------------------------
	 * require dependencies
	 * ---------------------------------------------*/
	let nconf = require.main.require('nconf'),
		ensureLoggedIn = require.main.require('connect-ensure-login'),
		SocketPlugins = require.main.require('./src/socket.io/plugins'),
		socketListeners = require('./src/socketListeners'),
		application = require('./src/application');

	var Plugin = {
		init: function (params, callback) {
			/* ================================================
			 * setup socket listeners
			 * ===============================================*/
			SocketPlugins.makeApplication = socketListeners;

			/* ---------------------------------------------
			 * setup GET routes
			 * ---------------------------------------------*/
			params.router.get('/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				params.middleware.buildHeader,
				application.getApplicationPage);

			params.router.get('/api/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.getApplicationPage);

			/* ---------------------------------------------
			 * setup POST routes
			 * ---------------------------------------------*/
			params.router.post('/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.postApplicationPage);

			/* ================================================
			 * return control to NodeBB
			 * ===============================================*/
			callback(null);
		},
		revertUID: function (topicData, callback) {
			if (topicData.realUID)
				topicData.uid = topicData.realUID;
			callback(null, topicData);
		},
		getPosts: function (data, callback) {
			// TODO: make a filter for sensitive info based on req.uid's Рыцари group membership
			callback(null, data);
		},
		parseApplication: application.parseApplication
	};

	module.exports = Plugin;
})();
