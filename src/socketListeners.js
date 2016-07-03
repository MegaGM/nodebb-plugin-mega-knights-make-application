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
	SocketIndex = require.main.require('./src/socket.io/index'),
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
let
	joinGroup = Promise.promisify(groups.join),
	leaveGroup = Promise.promisify(groups.leave),
	dbGetObject = Promise.promisify(db.getObject),
	isMemberOfGroups = Promise.promisify(groups.isMemberOfGroups),
	getTopicField = Promise.promisify(topics.getTopicField);

/* ================================================
 * Module methods
 * ===============================================*/
socketListeners.test = (socket, data, callback) => {
	let a = new Application(data.tid);
	a.calculateVotesSummary();
	callback(null, 'meow');
};

socketListeners.resolve = (socket, data, callback) => {
	// check data integrity
	if (!data || !data.type || !data.tid)
		return callback(true, 'invalid data');
	// if anon
	let
		type = data.type,
		uidResolver = parseInt(socket.uid),
		tid = parseInt(data.tid);
	if (!uidResolver || !tid)
		return callback(true, 'invalid tid');

	let whitelist = ['pend', 'resolve', 'approve', 'reject'];
	type = ('string' === typeof data.type) ? type : false;
	if (-1 === whitelist.indexOf(type))
		return callback(true, 'invalid type');

	let
		a = null,
		now = Date.now(),
		groupNames = config.groupNames,
		uidApplicant = 0,
		memberOf = {};

	return checkCid(tid)
		.then(() => {
			return getTopicField(tid, 'uid')
		})
		.then(_uidApplicant => {
			uidApplicant = _uidApplicant;
			return isMemberOfGroups(uidApplicant, groupNames);
		})
		.then(membershipList => {
			// find out users' groups
			return _.each(membershipList, (isMember, groupI) => {
				memberOf[groupNames[groupI]] = isMember;
			});
		})
		.then(() => {
			// decide if the user has permissions to get controls
			if (memberOf['Лидер'] || memberOf['Генералы'] || memberOf['Офицеры'])
				return 'mod';
			else
				return false;
		})
		.then(perm => {
			if (!perm) {
				let error = new Error();
				error.code = 'break';
				throw error;
			}
		})
		.then(() => {
			a = new Application(tid);
			return a[type](now, uidResolver);
		})
		.then(() => {
			// join or leave group
			return getTopicField(tid, 'cid')
				.then(cid => {
					let groupsToJoinOrLeave = null;
					_.each(config.groupsByCid, (groups, key) => {
						if (key !== cid) return;
						groupsToJoinOrLeave = groups;
					});
					return groupsToJoinOrLeave;
				})
				.then(groups => {
					// groups = ['Рыцари','APB'];
					return isMemberOfGroups(uidApplicant, groups)
						.then(membership => {
							// membership = [false,false];
							let grantToJoin = ('approve' === type); // true
							let grantToLeave = !('approve' === type); // true

							return Promise.map(groups, (groupName, groupI) => {
								if (grantToJoin && !membership[groupI])
									return joinGroup(groupName, uidApplicant);
								if (grantToLeave && membership[groupI])
									return leaveGroup(groupName, uidApplicant);
								return 'noop';
							});
						});
				});
		})
		.then(() => {
			// whether or not topic was locked
			let topicIsLocked = !('pend' === type);
			return {
				topicIsLocked
			};
		})
		.catch(catchBreak) // catch bad data.tid
		.then(result => {
			if (!result)
				return callback(true, 'break');
			else
				callback(null);

			// update UI
			SocketIndex.server.sockets.emit('plugins.makeApplication.event.resolve', {
				tid
			});

			if (result.topicIsLocked) {
				SocketIndex.server.sockets.emit('event:topic_locked', {
					tid,
					isLocked: result.topicIsLocked
				});
			} else {
				SocketIndex.server.sockets.emit('event:topic_unlocked', {
					tid,
					isLocked: result.topicIsLocked
				});
			}
		});
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

	let a = null,
		now = Date.now();
	checkCid(tid)
		.then(() => {
			a = new Application(tid);
			return a['vote' + type](now, uid);
		})
		.catch(catchBreak) // catch bad data.tid
		.then(result => {
			if (!result)
				return callback(true, 'break');
			else
				callback(null);
			SocketIndex.server.sockets.emit('plugins.makeApplication.event.vote', {
				tid
			});
		});
};

socketListeners.getControls = (socket, data, callback) => {
	// check data integrity
	if (!data || !data.tid)
		return callback(true, 'invalid data');

	// if anon
	let
		uid = parseInt(socket.uid),
		tid = parseInt(data.tid);
	if (!uid || !tid)
		return callback(true, 'invalid tid');

	let a = null;
	checkCid(data.tid)
		.then(() => {
			a = new Application(data.tid);
			return a.getControls(uid)
		})
		.catch(catchBreak) // catch bad data.tid
		.then(controls => {
			if (!controls)
				return callback(true, 'break');
			else
				return callback(null, controls);
		})
};

socketListeners.getSummary = (socket, data, callback) => {
	if (!data || !data.tid) return callback(true, 'invalid data');

	let a = null;
	checkCid(data.tid)
		.then(() => {
			a = new Application(data.tid);
			return a.getSummary();
		})
		.catch(catchBreak) // catch bad data.tid
		.then(summary => {
			if (!summary) return callback(true, 'break');
			callback(null, summary);
		});
};

socketListeners.getVotersPositive = (socket, data, callback) => {
	// TODO: implement
	callback(null);
};

socketListeners.getVotersNegative = (socket, data, callback) => {
	// TODO: implement
	callback(null);
};

socketListeners.getVotersJellyfish = (socket, data, callback) => {
	// TODO: implement
	callback(null);
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
	return false;
}
module.exports = socketListeners;
