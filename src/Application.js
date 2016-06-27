'use strict';

/* ================================================
 * Dependencies
 * ===============================================*/
let
	config = require('./config'),
	rKey = config.redisKey,
	Promise = require('bluebird'),
	db = require.main.require('./src/database/redis');

/* ================================================
 * Promisify
 * ===============================================*/
let
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
		this.votes = {
			pos: [],
			neg: [],
			jf: []
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
			sortedSetRemove(rKey + this.tid + ':votes' + ':jellyfish', uid)
		);
	}

	voteNegative(time, uid) {
		return Promise.join(
			sortedSetRemove(rKey + this.tid + ':votes' + ':positive', uid),
			sortedSetAdd(rKey + this.tid + ':votes' + ':negative', time, uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':jellyfish', uid)
		);
	}

	voteJellyfish(time, uid) {
		return Promise.join(
			sortedSetRemove(rKey + this.tid + ':votes' + ':positive', uid),
			sortedSetRemove(rKey + this.tid + ':votes' + ':negative', uid),
			sortedSetAdd(rKey + this.tid + ':votes' + ':jellyfish', time, uid)
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
