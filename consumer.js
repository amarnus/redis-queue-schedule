'use strict';

class Consumer {

    constructor(queueService) {
        this.queueService = queueService;
    }

    consume() {
        console.log('Consuming from universe...');
        this.queueService.dequeue('universe', (err, item) => {
            if (err) {
                console.error(`ERROR: Redis error while dequeuing from the
                    universe queue: ${ err.message }`);
                console.error(err.stack);
                return;
            }
            if (item) {
                console.log(`Consumed ${ item }...`);
            }
            setTimeout(this.consume.bind(this), 2000);
        });
    }

}

module.exports = Consumer;
