const guardIsFunction = require('./utils').guardIsFunction;

class ConcurrentQueue {
    constructor(client, queueName) {
        this._queueName = queueName;
        this._client = client;

        this._queueLock = `${queueName}.producer.lock`;
    }

    enqueue(message) {
        this._refreshLock();
        this._client.rpush(this._queueName, message);
    }

    acquireLock(cb) {
        guardIsFunction(cb);
        this._client
            .setnx(this._queueLock, 'lock', (err, result) => {
                if (err) return;
                if (result === 1) {
                    cb(true);
                } else {
                    cb(false);
                }
            });
    }

    _refreshLock() {
        this._client.expire(this._queueLock, 1);
    }

    dequeue(cb, timeout) {
        guardIsFunction(cb);
        
        this._client.blpop(this._queueName, 1, (err, value) => {
            if (err) return;            
            if (value) {
                const [, message] = value;
                cb(message);
            } else {
                timeout();
            }
        });
    }
}

module.exports = ConcurrentQueue;