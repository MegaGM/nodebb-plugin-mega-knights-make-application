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
	db = Promise.promisifyAll(require.main.require('./src/database')),
	groups = Promise.promisifyAll(require.main.require('./src/groups')),
	topics = Promise.promisifyAll(require.main.require('./src/topics')),
	user = Promise.promisifyAll(require.main.require('./src/user'));
let // logger
	log4js = require('log4js'),
	log = log4js.getLogger('Application');

/* ================================================
 * Promisify
 * ===============================================*/
topics.tools = Promise.promisifyAll(require.main.require('./src/topics').tools);

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
		return db.sortedSetAddAsync(rKey + 'created', time, this.tid);
	}

	getAreas() {
		return db.getAsync(rKey + this.tid + ':application')
			.then(JSON.parse);
	}

	setAreas(areas) {
		return db.setAsync(rKey + this.tid + ':application', JSON.stringify(areas));
	}

	getControls(uid) {
		let
			groupNames = config.groupNames,
			memberOf = {};
		return groups.isMemberOfGroupsAsync(uid, groupNames)
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
				return db.getObjectAsync(rKey + this.tid + ':status')
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

	getSummary(callerUID) {
		let summary = {};

		return Promise.join(
			db.getObjectAsync(rKey + this.tid + ':status'),
			db.getObjectAsync(rKey + this.tid + ':summary'),
			this.getVoters(callerUID),
			(status, votesSummary, voters) => {
				summary.status = typecastStatus(status);
				summary.votes = votesSummary;
				summary.voters = voters;
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
						return groups.isMembersAsync(uids, groupName);
					});
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
				return db.setObjectAsync(rKey + this.tid + ':summary', multipliedVotes)
					.thenReturn(multipliedVotes);
			});
	}

	getVotes() {
		return Promise.join(
			db.getSortedSetRevRangeWithScoresAsync(rKey + this.tid + ':votes' + ':positive', 0, -1),
			db.getSortedSetRevRangeWithScoresAsync(rKey + this.tid + ':votes' + ':negative', 0, -1),
			db.getSortedSetRevRangeWithScoresAsync(rKey + this.tid + ':votes' + ':jellyfish', 0, -1),
			(positive, negative, jellyfish) => {
				return {
					positive,
					negative,
					jellyfish
				};
			}
		);
	}

	getVoters(callerUID) {
		return this.getVotes()
			// { pos: [{value: '1' //uid, score: '1452982342' //time}], neg: ..., jell: ... }
			.then(votesSummary => {
				return Promise.map(Object.keys(votesSummary), typeKey => {
					// typeKey: pos, neg, jell
					return Promise.map(votesSummary[typeKey], voter => {
							let uid = voter.value;
							// voter = {value: '1' //uid, score: '1452982342' //time}
							return Promise.join(
								user.getUserFieldsAsync(uid, ['username', 'userslug']),
								groups.isMemberOfGroupsAsync(uid, config.groupNames),
								(user, membership) => {
									voter.username = user.username;
									voter.userslug = user.userslug;
									voter.group = config.groupNames[membership.lastIndexOf(true)];
									return groups.getGroupFieldsAsync(voter.group, ['labelColor'])
										.then(data => voter.labelColor = data.labelColor)
										.thenReturn(voter);
								}
							);
						})
						.then(voters => {
							let leader = /лидер/gi,
								general = /генерал/gi,
								officer = /офицер/gi,
								recruiter = /рекрутер/gi,
								knight = /рыцар/gi,
								friend = /соратник/gi,
								guest = 'Горожанин';

							function getWeight(name) {
								if (!name) return 0;
								if (name.match(leader)) return 100;
								if (name.match(general)) return 75;
								if (name.match(officer)) return 60;
								if (name.match(recruiter)) return 55;
								if (name.match(knight)) return 50;
								if (name.match(friend)) return 45;
								if (name.match(guest)) return 0;
								return 0;
							}

							return _.orderBy(voters, voter => {
								return getWeight(voter.group);
							}, ['desc']);
						})
				});
			})
			.spread((positive, negative, jellyfish) => {
				return {
					positive,
					negative,
					jellyfish
				};
			})
			.then(voters => {
				// check if it's okay to show to user the voters
				return groups.isMemberOfGroupsAsync(callerUID, config.groupNames)
					.then(membership => {
						if (membership.lastIndexOf(true) > 0)
							return voters;
						else
							return null;
					});
			})
	}

	votePositive(time, uid) {
		return Promise.join(
			db.sortedSetAddAsync(rKey + this.tid + ':votes' + ':positive', time, uid),
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':negative', uid),
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':jellyfish', uid),
			this.calculateVotesSummary(),
			(a, b, c, votesSummary) => {
				return votesSummary;
			}
		);
	}

	voteNegative(time, uid) {
		return Promise.join(
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':positive', uid),
			db.sortedSetAddAsync(rKey + this.tid + ':votes' + ':negative', time, uid),
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':jellyfish', uid),
			this.calculateVotesSummary(),
			(a, b, c, votesSummary) => {
				return votesSummary;
			}
		);
	}

	voteJellyfish(time, uid) {
		return Promise.join(
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':positive', uid),
			db.sortedSetRemoveAsync(rKey + this.tid + ':votes' + ':negative', uid),
			db.sortedSetAddAsync(rKey + this.tid + ':votes' + ':jellyfish', time, uid),
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
			db.sortedSetAddAsync(rKey + 'pending', time, this.tid),
			db.sortedSetRemoveAsync(rKey + 'resolved', this.tid),
			db.sortedSetRemoveAsync(rKey + 'approved', this.tid),
			db.sortedSetRemoveAsync(rKey + 'rejected', this.tid),
			db.setObjectAsync(rKey + this.tid + ':status', this.status),
			topics.tools.unlockAsync(this.tid, 1),
			this.setResolver(0)
		);
	}

	resolve(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			db.sortedSetRemoveAsync(rKey + 'pending', this.tid),
			db.sortedSetAddAsync(rKey + 'resolved', time, this.tid),
			db.sortedSetRemoveAsync(rKey + 'approved', this.tid),
			db.sortedSetRemoveAsync(rKey + 'rejected', this.tid),
			db.setObjectAsync(rKey + this.tid + ':status', this.status),
			topics.tools.lockAsync(this.tid, uid),
			this.setResolver(uid)
		);
	}

	approve(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = time;
		this.status.rejected = 0;

		return Promise.join(
			db.sortedSetRemoveAsync(rKey + 'pending', this.tid),
			db.sortedSetAddAsync(rKey + 'resolved', time, this.tid),
			db.sortedSetAddAsync(rKey + 'approved', time, this.tid),
			db.sortedSetRemoveAsync(rKey + 'rejected', this.tid),
			db.setObjectAsync(rKey + this.tid + ':status', this.status),
			topics.tools.lockAsync(this.tid, uid),
			this.setResolver(uid)
		);
	}

	reject(time, uid) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = time;

		return Promise.join(
			db.sortedSetRemoveAsync(rKey + 'pending', this.tid),
			db.sortedSetAddAsync(rKey + 'resolved', time, this.tid),
			db.sortedSetRemoveAsync(rKey + 'approved', this.tid),
			db.sortedSetAddAsync(rKey + 'rejected', time, this.tid),
			db.setObjectAsync(rKey + this.tid + ':status', this.status),
			topics.tools.lockAsync(this.tid, uid),
			this.setResolver(uid)
		);
	}

	setResolver(uid) {
		if (!(uid = parseInt(uid))) return;

		let
			groupNames = config.groupNames,
			memberOf = {},
			resolver = {};

		return groups.isMemberOfGroupsAsync(uid, groupNames)
			.then(membershipList => {
				// find out users' groups
				return _.each(membershipList, (isMember, groupI) => {
					memberOf[groupNames[groupI]] = isMember;
				});
			})
			.then(() => {
				return user.getUserFieldsAsync(uid, ['username', 'userslug'])
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
				return db.setObjectAsync(rKey + this.tid + ':status', {
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
