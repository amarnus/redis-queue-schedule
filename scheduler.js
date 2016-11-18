'use strict';

const async = require('async');

class Scheduler {

    constructor(redisClient, moverService) {
        this.redisClient = redisClient;
        this.moverService = moverService;
    }

    pickQueues(count, maxSize, minSize, cb) {
        minSize = minSize || 0;
        this.redisClient.zrevrangebyscore('queue_size_zset', maxSize, minSize, 'LIMIT', 0, count, cb);
    }

    _run(count, maxSize, minSize, cb) {
        async.waterfall([
            (next) => {
                this.pickQueues(count, maxSize, minSize, next);
            },
            (queueNames, next) => {
                this.moverService.moveItemsMany(queueNames, 1, next);
            }
        ], cb);
    }

    run() {
        const QUEUE_COUNT = 5;
        setInterval(() => {
            this._run(QUEUE_COUNT, 10);
            this._run(QUEUE_COUNT, '+Inf', 11);
        }, 5000);
        this._run(QUEUE_COUNT, 10);
        this._run(QUEUE_COUNT, '+Inf', 11);
    }

};

module.exports = Scheduler;
