'use strict';

const async = require('async');

class Mover {

    constructor(redisClient, queueService) {
        this.redisClient = redisClient;
        this.queueService = queueService;
    }

    moveItems(queueName, limitTo, cb) {
        async.times(limitTo, (n, next) => {
            this.redisClient.multi()
                .rpoplpush(`queue_${ queueName }_list`, 'queue_universe_list')
                .zincrby('queue_size_zset', -1, queueName)
                .exec(next);
        }, cb);
    }

    moveItemsMany(queueNames, limitTo, cb) {
        limitTo = limitTo || 10;
        async.map(queueNames, queueName => {
            this.moveItems(queueName, limitTo, cb);
        }, cb);
    }

}

module.exports = Mover;
