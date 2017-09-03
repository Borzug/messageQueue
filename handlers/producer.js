const uuid = require('uuid');
const guardIsFunction = require('../utils/utils').guardIsFunction;

MESSAGE_GENERATION_INTERVAL = 500; // in milliseconds

class Producer {
    constructor(queue) {
        this._queue = queue;
    }

    start(cb) {
        guardIsFunction(cb);
        this._queue.acquireLock((result) => {
            if(result) {
                cb(true, () => this._produce());
            } else {
                cb(false, null);
            }
        })
    }

    _produce() {
        console.log('Firing message');
        this._queue.enqueue(uuid.v1());
        setTimeout(() => this._produce(), MESSAGE_GENERATION_INTERVAL);
    }
}

module.exports = Producer;