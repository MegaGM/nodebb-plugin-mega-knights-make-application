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

let // logger
	log4js = require('log4js'),
	log = log4js.getLogger('socketListeners');

let // templates
	Handlebars = require('handlebars');
require('../client/templates');

/* ================================================
 * Promisify
 * ===============================================*/
let dbGetObject = Promise.promisify(db.getObject),
	getTopicField = Promise.promisify(topics.getTopicField);

/* ================================================
 * Module methods
 * ===============================================*/
socketListeners.test = (socket, data, callback) => {
	let a = new Application(data.tid);
	a.calculateVotesSummary();
	callback(null, 'meow');
};

socketListeners.vote = (socket, data, callback) => {
	// check data integrity
	if (!data || !data.type || !data.tid)
		return callback(true, 'invalid data');

	// if anon
	let
		type = data.type,
		uid = parseInt(socket.uid),
		tid = parseInt(data.tid);
	if (!uid || !tid)
		return callback(true, 'invalid tid');

	// check Capitalized data.type
	let whitelist = ['Positive', 'Negative', 'Jellyfish'];
	type = ('string' === typeof data.type) ?
		type.charAt(0).toUpperCase() + type.slice(1) : false;
	if (-1 === whitelist.indexOf(type))
		return callback(true, 'invalid type');

	let a = new Application(tid),
		now = Date.now();

	// TODO: stub
	uid = data.uid;

	a['vote' + type](now, uid)
		.then(votesSummary => {
			callback(null, votesSummary);
		});
};

socketListeners.getSummary = (socket, data, callback) => {
	// TODO: debug
	log.debug('getSummary\n', data);
	if (!data || !data.tid) return callback(true, 'invalid data');

	let a = null;
	checkCid(data.tid)
		.then(() => {
			a = new Application(data.tid);
			return Promise.join(
				a.getStatus(),
				a.getSummary(),
				(status, votes) => {
					log.debug('status\n', status);
					log.debug('votes: \n', votes);
					return {
						status,
						votes
					};
				}
			);
		})
		.catch(catchBreak)
		.then(summary => {
			if (!summary) return callback(true, 'break');
			callback(null, summary);
		});
};

socketListeners.getVotersPositive = (socket, data, callback) => {
	// TODO: debug
	log.debug('getVotes\n', data);
	callback(null);
};

socketListeners.getVotersNegative = (socket, data, callback) => {
	// TODO: debug
	log.debug('getVotes\n', data);
	callback(null);
};

socketListeners.getVotersJellyfish = (socket, data, callback) => {
	// TODO: debug
	log.debug('getVotes\n', data);
	callback(null);
};

socketListeners.getControls = (socket, data, callback) => {
	// TODO: debug
	log.debug('getControls\n', data);
	callback(null, {
		answer: 'meow!'
	});
};

/* ================================================
 * Global helpers
 * ===============================================*/
function checkCid(tid) {
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
