'use strict';

class Producer {

    constructor(queueService) {
        this.queueService = queueService;
    }

    // Queue name
    // Queue item
    // Rate of production by queue

    produce() {
        const queueName = 'foo';
        const item = '@amarnus';
        this.queueService.enqueue(queueName, item, err => {
            if (err) {
                console.error(`ERROR: Redis error while enqueuing in the
                    ${ queueName } queue: ${ err.message }`);
                console.error(err.stack);
                return;
            }
            console.log(`Produced ${ item } in ${ queueName }...`);
        });
    }

}

module.exports = Producer;
