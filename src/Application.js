'use strict';

/* ================================================
 * Dependencies
 * ===============================================*/
let
	config = require('./config'),
	Promise = require('bluebird'),
	db = require.main.require('./src/database/redis');

/* ================================================
 * Promisify
 * ===============================================*/
let
	getObject = Promise.promisify(db.getObject),
	setObject = Promise.promisify(db.setObject),
	sortedSetAdd = Promise.promisify(db.sortedSetAdd),
	sortedSetRemove = Promise.promisify(db.sortedSetRemove);

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
		return sortedSetAdd(config.redisKey + 'created', time, this.tid);
	}

	// TODO: test this method
	getAreas() {
		return getObject(config.redisKey + this.tid + ':application');
	}

	setAreas(areas) {
		return setObject(config.redisKey + this.tid + ':application', areas);
	}

	approve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = time;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(config.redisKey + 'pending', this.tid),
			sortedSetAdd(config.redisKey + 'resolved', time, this.tid),
			sortedSetAdd(config.redisKey + 'approved', time, this.tid),
			sortedSetRemove(config.redisKey + 'rejected', this.tid),
			setObject(config.redisKey + this.tid + ':status', this.status)
		);
	}

	reject(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = time;

		return Promise.join(
			sortedSetRemove(config.redisKey + 'pending', this.tid),
			sortedSetAdd(config.redisKey + 'resolved', time, this.tid),
			sortedSetRemove(config.redisKey + 'approved', this.tid),
			sortedSetAdd(config.redisKey + 'rejected', time, this.tid),
			setObject(config.redisKey + this.tid + ':status', this.status)
		);
	}

	pend(time) {
		this.status.pending = time;
		this.status.resolved = 0;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetAdd(config.redisKey + 'pending', time, this.tid),
			sortedSetRemove(config.redisKey + 'resolved', this.tid),
			sortedSetRemove(config.redisKey + 'approved', this.tid),
			sortedSetRemove(config.redisKey + 'rejected', this.tid),
			setObject(config.redisKey + this.tid + ':status', this.status)
		);
	}

	resolve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = 0;

		return Promise.join(
			sortedSetRemove(config.redisKey + 'pending', this.tid),
			sortedSetAdd(config.redisKey + 'resolved', time, this.tid),
			sortedSetRemove(config.redisKey + 'approved', this.tid),
			sortedSetRemove(config.redisKey + 'rejected', this.tid),
			setObject(config.redisKey + this.tid + ':status', this.status)
		);
	}
}
