const ConcurrentQueue = require('../utils/concurrent-queue');
const errorHandler = require('./error-handler');
const handler = require('./handler');

const errorQueueName = 'report-errors-queue';
const handlerQueueName = 'report-queue';

function getQueue(client, queueName) {
    return new ConcurrentQueue(client, queueName);
}

function getErrorQueue(client) {
    return getQueue(client, errorQueueName);
}

function getHandlerQueue(client) {
    return getQueue(client, handlerQueueName);
}

const handlers = {
    'getErrors': function (client) {
        errorHandler(getErrorQueue(client), () => { process.exit() });
    },
    'handler': function(client) {
        handler(getHandlerQueue(client), getErrorQueue(client));
    }
}

module.exports = function (handlerType) {
    if (handlerType in handlers) {
        return handlers[handlerType];
    }

    return handlers['handler'];
}