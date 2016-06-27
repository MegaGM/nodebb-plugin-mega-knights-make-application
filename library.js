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
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				params.middleware.buildHeader,
				application.getApplicationPage);

			params.router.get('/api/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.getApplicationPage);

			// post
			params.router.post('/make-application',
				ensureLoggedIn.ensureLoggedIn(nconf.get('relative_path') + '/login'),
				application.postApplicationPage);

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
