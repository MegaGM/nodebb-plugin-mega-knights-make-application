'use strict';

/* ================================================
 * Define module
 * ===============================================*/
let socketListeners = {};

/* ================================================
 * Dependencies
 * ===============================================*/
let
	config = require('./config'),
	_ = require('lodash'),
	Promise = require('bluebird'),
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups'),
	topics = require.main.require('./src/topics'),
	Application = require('./Application');

let Handlebars = require('handlebars');
require('../client/templates');

/* ================================================
 * Promisify
 * ===============================================*/
let dbGetObject = Promise.promisify(db.getObject),
	getTopicField = Promise.promisify(topics.getTopicField);

/* ================================================
 * Module methods
 * ===============================================*/
socketListeners.getSummary = (socket, data, callback) => {
	// TODO: debug
	console.log('getSummary', data);
	if (!data || !data.tid) return callback(true, 'break');

	let a = null;
	checkCid(data.tid)
		.then(() => {
			a = new Application(data.tid);
			return Promise.join(
				a.getStatus(),
				a.getVotes(),
				(status, votes) => {
					console.log('status', status);
					console.log('votes: ', votes);
					// status = Handlebars.partials['application-status']({
					// 	status
					// });
					return {
						status,
						votes
					};
				}
			);
		})
		.catch(catchBreak)
		.then(aData => {
			if (!aData) return;
			callback(null, aData);
		});
};

socketListeners.getVotersPositive = (socket, data, callback) => {
	// TODO: debug
	console.log('getVotes', data);
	callback(null);
};

socketListeners.getVotersNegative = (socket, data, callback) => {
	// TODO: debug
	console.log('getVotes', data);
	callback(null);
};

socketListeners.getVotersJellyfish = (socket, data, callback) => {
	// TODO: debug
	console.log('getVotes', data);
	callback(null);
};

socketListeners.getControls = (socket, data, callback) => {
	// TODO: debug
	console.log('getControls', data);
	callback(null, {
		answer: 'meow!'
	});
};

/* ================================================
 * Global helpers
 * ===============================================*/
function checkCid(tid) {
	// $('[data-index="0"]')
	return getTopicField(tid, 'cid')
		.then(cid => {
			return _.some(config.gameCids, gameCid => cid == gameCid);
		})
		.then(ok => {
			if (!ok) {
				let error = new Error();
				error.code = 'break';
				throw error;
			}
		})
}

function catchBreak(err) {
	if ('break' !== err.code) throw err;
}
module.exports = socketListeners;
