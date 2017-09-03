module.exports = function printError(errorQueue, cb) {
    errorQueue.dequeue(function(message) {
        console.log(message);
        printError(errorQueue, cb);
    }, cb)};