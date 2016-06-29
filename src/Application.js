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
	db = require.main.require('./src/database/redis'),
	groups = require.main.require('./src/groups');
let // logger
	log4js = require('log4js'),
	log = log4js.getLogger('Application');

/* ================================================
 * Promisify
 * ===============================================*/
let
	isMembersOfGroup = Promise.promisify(groups.isMembers),
	getObject = Promise.promisify(db.getObject),
	setObject = Promise.promisify(db.setObject),
	sortedSetAdd = Promise.promisify(db.sortedSetAdd),
	sortedSetRemove = Promise.promisify(db.sortedSetRemove),
	getSortedSetRevRangeWithScores = Promise.promisify(db.getSortedSetRevRangeWithScores);

module.exports = class Application {
	constructor(tid) {
		this.tid = tid;
		this.status = {
			pending: 0,
			resolved: 0,
			approved: 0,
			rejected: 0
		};
	}

	setCreationTime(time) {
		return sortedSetAdd(rKey + 'created', time, this.tid);
	}

	// TODO: test this method
	getAreas() {
		return getObject(rKey + this.tid + ':application');
	}

	setAreas(areas) {
		return setObject(rKey + this.tid + ':application', areas);
	}

	getStatus() {
		return getObject(rKey + this.tid + ':status');
	}

	getSummary() {
		return getObject(rKey + this.tid + ':summary')
			.then(summary => {
				if (!summary)
					return this.calculateVotesSummary();
				return summary;
			})
	}

	calculateVotesSummary() {
		// TODO: debug
		let start = Date.now();
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
				// TODO: debug
				log.debug('uids: \n', uids);
				return Promise
					.map(groupNames, groupName => {
						// get an array of membership lists
						return isMembersOfGroup(uids, groupName);
					})
			})
			.then(membershipLists => {
				// compute memberOf hash
				return _.each(membershipLists, (membershipList, groupI) => {
					// TODO: debug
					log.debug('membershipList: \n', membershipList);
					return _.each(membershipList, (isMember, uidI) => {
						if (!memberOf[groupNames[groupI]])
							memberOf[groupNames[groupI]] = {};
						memberOf[groupNames[groupI]][uids[uidI]] = isMember;
					});
				});
			})
			.then(() => {
				// TODO: debug
				log.debug('memberOf: \n', memberOf);
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
				// TODO: debug
				log.debug('uidMultipliers: \n', uidMultipliers);
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
				// TODO: debug
				log.debug('multipliedVotes\n', multipliedVotes);
				// TODO: debug
				log.debug('last chain in calculateVotesSummary: \n', Date.now() - start);

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

	approve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = time;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetAdd(rKey + 'approved', time, this.tid),
			sortedSetRemove(rKey + 'rejected', this.tid),
			setObject(rKey + this.tid + ':status', this.status)
		);
	}

	reject(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = time;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetRemove(rKey + 'approved', this.tid),
			sortedSetAdd(rKey + 'rejected', time, this.tid),
			setObject(rKey + this.tid + ':status', this.status)
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
			setObject(rKey + this.tid + ':status', this.status)
		);
	}

	resolve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(rKey + 'pending', this.tid),
			sortedSetAdd(rKey + 'resolved', time, this.tid),
			sortedSetRemove(rKey + 'approved', this.tid),
			sortedSetRemove(rKey + 'rejected', this.tid),
			setObject(rKey + this.tid + ':status', this.status)
		);
	}
}

function getVoteMultiplier() {}
