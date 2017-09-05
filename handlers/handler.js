const Producer = require('./producer');
const Consumer = require('./consumer');

const GENERATOR_CHECK_RATE = 500; // in milliseconds

module.exports = function (queue, errorQueue) {
    const producer = new Producer(queue);
    const consumer = new Consumer(queue, errorQueue);    
    consumer.start();
    tryProduce();    

    function tryProduce() {
        producer.start(function(isProducing, produce) {            
            if (isProducing) {
                consumer.stop(produce);
            } else {
                setTimeout(tryProduce, GENERATOR_CHECK_RATE);
            }
        });
    }
}