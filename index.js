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

function uncaughtException(err) {
    console.log('Unhandled Exception:' + err);
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