'use strict';

/* ================================================
 * Dependencies
 * ===============================================*/
let // local
	config = require('./config'),
	rKey = config.redisKey;
let // npm
	_ = require('lodash'),
	Promise = require('bluebird');
let // NodeBB
	db = require.main.require('./src/database'),
	groups = require.main.require('./src/groups'),
	topics = require.main.require('./src/topics'),
	user = require.main.require('./src/user');
let // logger
	log4js = require('log4js'),
	log = log4js.getLogger('Application');

/* ================================================
 * Promisify
 * ===============================================*/
let
	lockTopic = Promise.promisify(topics.tools.lock),
	unlockTopic = Promise.promisify(topics.tools.unlock),
	getUserFields = Promise.promisify(user.getUserFields),
	isMemberOfGroups = Promise.promisify(groups.isMemberOfGroups),
	isMembersOfGroup = Promise.promisify(groups.isMembers),
	getKey = Promise.promisify(db.get),
	setKey = Promise.promisify(db.set),
	getObject = Promise.promisify(db.getObject),
	setObject = Promise.promisify(db.setObject),
	sortedSetAdd = Promise.promisify(db.sortedSetAdd),
	sortedSetRemove = Promise.promisify(db.sortedSetRemove),
	getSortedSetRevRangeWithScores = Promise.promisify(db.getSortedSetRevRangeWithScores);

module.exports = class Application {
	constructor(tid) {
		this.tid = tid;
		this.status = {
			resolver: 0,
			pending: 0,
			resolved: 0,
			approved: 0,
			rejected: 0
		};
	}

	setCreationTime(time) {
		return sortedSetAdd(rKey + 'created', time, this.tid);
	}

	getAreas() {
		return getKey(rKey + this.tid + ':application')
			.then(JSON.parse);
	}

	setAreas(areas) {
		return setKey(rKey + this.tid + ':application', JSON.stringify(areas));
	}

	getControls(uid) {
		let
			groupNames = config.groupNames,
			memberOf = {};
		return isMemberOfGroups(uid, groupNames)
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
				else if (memberOf['Рекрутеры'] || memberOf['Рыцари'])
					return 'regular';
				else
					return false;
			})
			.then(perm => {
				if (!perm) return 'break';
				return getObject(rKey + this.tid + ':status')
					.then(status => {
						status = typecastStatus(status);
						return {
							status,
							controls: {
								regular: perm && !status.resolved,
								mod: (perm === 'mod')
							}
						};
					})
			});
	}

	getSummary() {
		let summary = {};

		return Promise.join(
			getObject(rKey + this.tid + ':status'),
			getObject(rKey + this.tid + ':summary'),
			(status, votesSummary) => {
				summary.status = typecastStatus(status);
				summary.votes = votesSummary;
				if (!summary.votes ||
					!summary.votes.positive || !summary.votes.negative || !summary.votes.jellyfish)
					return this.calculateVotesSummary()
						.then(votesSummary => {
							summary.votes = votesSummary;
							return summary;
						});

				return summary;
			})
	}

	calculateVotesSummary() {
		let
			votes,
			uids = [],
			memberOf = {},
			uidMultipliers = {},
			groupNames = config.groupNames;

		return this.getVotes()
			.then(_votes => {
				votes = _votes;
				// pick uids
				return _.each(votes, type => {
					_.each(type, vote => {
						let uid = vote.value;
						uids.push(uid);
					});
				});
			})
			.then(() => {
				return Promise
					.map(groupNames, groupName => {
						// get an array of membership lists
						return isMembersOfGroup(uids, groupName);
					})
			})
			.then(membershipLists => {
				// compute memberOf hash
				return _.each(membershipLists, (membershipList, groupI) => {
					return _.each(membershipList, (isMember, uidI) => {
						if (!memberOf[groupNames[groupI]])
							memberOf[groupNames[groupI]] = {};
						memberOf[groupNames[groupI]][uids[uidI]] = isMember;
					});
				});
			})
			.then(() => {
				// compute vote multiplier
				return _.each(uids, uid => {
					let multiplier = 0;
					_.each(groupNames, groupName => {
						if (memberOf[groupName][uid])
							multiplier = config.voteMultipliers[groupName];
					});
					uidMultipliers[uid] = multiplier;
				});
			})
			.then(() => {
				// compute multiplied votes
				return Promise
					.map(Object.keys(votes), typeKey => {
						let voters = votes[typeKey];
						return Promise.reduce(voters, (total, vote) => {
							let uid = vote.value;
							return total + (1 * uidMultipliers[uid]);
						}, 0)
					})
					.spread((positive, negative, jellyfish) => {
						return {
							positive,
							negative,
							jellyfish
						};
					});
			})
			.then(multipliedVotes => {
				return setObject(rKey + this.tid + ':summary', multipliedVotes)
					.thenReturn(multipliedVotes);
			});
	}

	getVotes() {
		return Promise.join(
			getSortedSetRevRangeWithScores(rKey + this.tid + ':votes' + ':positive', 0, -1),
			getSortedSetRevRangeWithScores(rKey + this.tid + ':votes' + ':negative', 0, -1),
			getSortedSetRevRangeWithScores(rKey + this.tid + ':votes' + ':jellyfish', 0, -1),
			(positive, negative, jellyfish) => {
				return {
					positive,
					negative,
					jellyfish
				};
			}
		);
	}

	votePositive(time, uid) {
		return Promise.join(
			sortedSetAdd(rKey + this.tid + ':votes' + ':positive', time, uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':negative', uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':jellyfish', uid),
			this.calculateVotesSummary(),
			(a, b, c, votesSummary) => {
				return votesSummary;
			}
		);
	}

	voteNegative(time, uid) {
		return Promise.join(
			sortedSetRemove(rKey + this.tid + ':votes' + ':positive', uid),
			sortedSetAdd(rKey + this.tid + ':votes' + ':negative', time, uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':jellyfish', uid),
			this.calculateVotesSummary(),
			(a, b, c, votesSummary) => {
				log.debug('vote negative: \n', a, b, c, votesSummary);
				return votesSummary;
			}
		);
	}

	voteJellyfish(time, uid) {
		return Promise.join(
			sortedSetRemove(rKey + this.tid + ':votes' + ':positive', uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':negative', uid),
			sortedSetAdd(rKey + this.tid + ':votes' + ':jellyfish', time, uid),
			this.calculateVotesSummary(),
			(a, b, c, votesSummary) => {
				return votesSummary;
			}
		);
	}

	pend(time) {
		this.status.pending = time;
		this.status.resolved = 0;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetAdd(rKey + 'pending', time, this.tid),
			sortedSetRemove(rKey + 'resolved', this.tid),
			sortedSetRemove(rKey + 'approved', this.tid),
			sortedSetRemove(rKey + 'rejected', this.tid),
			setObject(rKey + this.tid + ':status', this.status),
			unlockTopic(this.tid, 1),
			this.setResolver(0)
		);
	}

	resolve(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetRemove(rKey + 'approved', this.tid),
			sortedSetRemove(rKey + 'rejected', this.tid),
			setObject(rKey + this.tid + ':status', this.status),
			lockTopic(this.tid, uid),
			this.setResolver(uid)
		);
	}

	approve(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = time;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetAdd(rKey + 'approved', time, this.tid),
			sortedSetRemove(rKey + 'rejected', this.tid),
			setObject(rKey + this.tid + ':status', this.status),
			lockTopic(this.tid, uid),
			this.setResolver(uid)
		);
	}

	reject(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = time;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetRemove(rKey + 'approved', this.tid),
			sortedSetAdd(rKey + 'rejected', time, this.tid),
			setObject(rKey + this.tid + ':status', this.status),
			lockTopic(this.tid, uid),
			this.setResolver(uid)
		);
	}

	setResolver(uid) {
		if (!(uid = parseInt(uid))) return;

		let
			groupNames = config.groupNames,
			memberOf = {},
			resolver = {};

		return isMemberOfGroups(uid, groupNames)
			.then(membershipList => {
				// find out users' groups
				return _.each(membershipList, (isMember, groupI) => {
					memberOf[groupNames[groupI]] = isMember;
				});
			})
			.then(() => {
				return getUserFields(uid, ['username', 'userslug'])
					.then(userFields => {
						resolver.username = userFields.username;
						resolver.userslug = userFields.userslug;
					});
			})
			.then(() => {
				resolver.uid = uid;
				if (memberOf['Офицеры'])
					resolver.role = 'officer';
				if (memberOf['Генералы'])
					resolver.role = 'general';
				if (memberOf['Лидер'])
					resolver.role = 'leader';
			})
			.then(() => {
				return setObject(rKey + this.tid + ':status', {
					resolver: JSON.stringify(resolver)
				});
			})
	}

}

function typecastStatus(status) {
	// typecast after Redis >.<
	status.resolver = status.resolver === '0' ?
		0 : JSON.parse(status.resolver);
	status.pending = parseInt(status.pending);
	status.resolved = parseInt(status.resolved);
	status.approved = parseInt(status.approved);
	status.rejected = parseInt(status.rejected);
	return status;
}
