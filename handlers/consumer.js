const guardIsFunction = require('../utils/utils').guardIsFunction;

const ERROR_CHANCE = 5.0;

class Consumer {
    constructor(queue, errorQueue) {
        this._queue = queue;
        this._errorQueue = errorQueue;
        this._shouldStop = false;
    }

    start() {
        if (this._stopCheck())
            return;

        this._queue.dequeue((message) => {            
            if (Math.random() * 100 < ERROR_CHANCE) {
                this._errorQueue.enqueue(message);
                console.log("Error!");
            } else {
                console.log(message);
            }

            setTimeout(() => this.start(), 0);
        },
            () => setTimeout(() => this.start(), 0)
        );
    }

    _stopCheck() {
        if (this._shouldStop) {
            console.log('Handling stopped');
            if (this._onConsumerStopped) {
                this._onConsumerStopped();
            }
            return true;
        }
        return false;
    }

    stop(cb) {
        guardIsFunction(cb);
        this._shouldStop = true;
        this._onConsumerStopped = cb;
    }
}

module.exports = Consumer;