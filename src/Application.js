let config = require('./config'),
	db = require.main.require('./src/database/redis');

module.exports = class Application {
	constructor(tid) {
		this.tid = tid;
		this.status = {
			pending: false,
			resolved: false,
			approved: false,
			rejected: false
		};
	}

	setCreationTime(time, callback) {
		db.sortedSetAdd(config.redisKey + 'created', time, this.tid);
	}

	approve(time, callback) {
		this.status.pending = false;
		this.status.resolved = true;
		this.status.approved = true;
		this.status.rejected = false;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetAdd(config.redisKey + 'approved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	reject(time, callback) {
		this.status.pending = false;
		this.status.resolved = true;
		this.status.approved = false;
		this.status.rejected = true;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetAdd(config.redisKey + 'rejected', time, this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	pend(time, callback) {
		this.status.pending = true;
		this.status.resolved = false;
		this.status.approved = false;
		this.status.rejected = false;
		db.sortedSetAdd(config.redisKey + 'pending', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'resolved', this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}

	resolve(time, callback) {
		this.status.pending = false;
		this.status.resolved = true;
		this.status.approved = false;
		this.status.rejected = false;
		db.sortedSetRemove(config.redisKey + 'pending', this.tid);
		db.sortedSetAdd(config.redisKey + 'resolved', time, this.tid);
		db.sortedSetRemove(config.redisKey + 'approved', this.tid);
		db.sortedSetRemove(config.redisKey + 'rejected', this.tid);
		db.setObject(config.redisKey + this.tid + ':status', this.status);
	}
}