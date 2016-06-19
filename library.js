(function () {
	'use strict';

	/* ---------------------------------------------
	 * require dependencies
	 * ---------------------------------------------*/
	var nconf = require.main.require('nconf'),
		ensureLoggedIn = require.main.require('connect-ensure-login'),
		application = require('./src/application');

	var Plugin = {
		/* ---------------------------------------------
		 * setup routes
		 * ---------------------------------------------*/
		init: function (params, callback) {
			// get
			params.router.get('/make-application',
				// TODO: uncomment
				// ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				params.middleware.buildHeader,
				application.getApplicationPage);

			params.router.get('/api/make-application',
				// TODO: uncomment
				// ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.getApplicationPage);

			// post
			params.router.post('/make-application',
				// TODO: uncomment
				// ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.postApplicationPage);

			callback(null);
		},
		revertUID: function (topicData, callback) {
			if (topicData.realUID)
				topicData.uid = topicData.realUID;
			callback(null, topicData);
		},
		parseApplication: application.parseApplication
	};

	module.exports = Plugin;
})();
