'use strict';

class Queue {

    constructor(redisClient, trackSize) {
        this.redisClient = redisClient;
        this.trackSize = !!trackSize;
    }

    enqueue(name, item, cb) {
        const trans = this.redisClient.multi();
        trans.lpush(`queue_${ name }_list`, item);
        if (this.trackSize) {
            trans.zincrby('queue_size_zset', 1, name);
        }
        trans.exec((err, replies) => {
            if (err) {
                return cb(err);
            }
            return cb(null, replies[0]);
        });
    }

    dequeue(name, cb) {
        const trans = this.redisClient.multi();
        trans.rpop(`queue_${ name }_list`);
        if (this.trackSize) {
            trans.rpop(`queue_${ name }_list`);
        }
        trans.exec((err, replies) => {
            if (err) {
                return cb(err);
            }
            return cb(null, replies[0]);
        });
    }

};

module.exports = Queue;
