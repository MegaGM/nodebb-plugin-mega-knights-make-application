'use strict';

let config = require('./config'),
	db = require.main.require('./src/database/redis');

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
		db.sortedSetAdd(config.redisKey + 'created', time, this.tid);
	}

	// TODO: test this method
	getAreas(callback) {
		db.getObject(config.redisKey + this.tid + ':application', callback);
	}

	setAreas(areas, callback) {
		db.setObject(config.redisKey + this.tid + ':application', areas, callback);
	}

	approve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = time;
		this.status.rejected = 0;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetAdd(config.redisKey + 'approved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	reject(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = time;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetAdd(config.redisKey + 'rejected', time, this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	pend(time) {
		this.status.pending = time;
		this.status.resolved = 0;
		this.status.approved = 0;
		this.status.rejected = 0;
		db.sortedSetAdd(config.redisKey + 'pending', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'resolved', this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	resolve(time) {
		this.status.pending = 0;
		this.status.resolved = time;
		this.status.approved = 0;
		this.status.rejected = 0;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}
}
