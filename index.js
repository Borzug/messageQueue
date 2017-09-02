const redis = require("redis");
const handlersFactory = require('./handlers/handler-factory');

const client = redis.createClient();
const [,, param] = [...process.argv];

const handler = handlersFactory(param);
handler(client);

process
    .on('SIGTERM', shutdown)
    .on('SIGINT', shutdown)
    .on('uncaughtException', uncaughtException);

function uncaughtException(reason, p) {
    console.log('Unhandled Exception at:', p, 'reason:', reason);
    shutdown();
}

function shutdown() {
    console.log('Shutting down...');
    if (!client.quit(function () {
            process.exit();
        })) {
        process.exit();
    };
}