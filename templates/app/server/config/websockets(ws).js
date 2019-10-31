/**
 * Socket.io configuration
 */
import path from 'path';
import Primus from 'primus';
import primusEmit from 'primus-emit';

const registerFunctions = [
    // Insert sockets below
    require('../api/thing/thing.socket').register,
];

// When the user disconnects.. perform this
function onDisconnect(spark) {
    console.info(`WebSocket from ${spark.address.ip}:${spark.address.port} disconnected`);
}

// When the user connects.. perform this
function onConnect(spark) {
    console.info(`WebSocket from ${spark.address.ip}:${spark.address.port} connected`);

    // When the client emits 'info', this listens and executes
    spark.on('info', data => {
        spark.log(JSON.stringify(data, null, 2));
    });

    // Register the spark with each WebSocket event handler
    // For some reason this is needed:
    // eslint-disable-next-line no-unused-vars
    for(const register of registerFunctions) {
        register(spark);
    }
}

let primus;

export function broadcast(message) {
    primus.forEach(spark => {
        spark.emit('broadcast', message);
    });
}

export default function initWebSocketServer(server) {
    primus = new Primus(server, {});
    primus.plugin('emit', primusEmit);

    primus.on('connection', onConnect);
    primus.on('disconnection', onDisconnect);

    if(process.env.NODE_ENV === 'development') {
        return new Promise((resolve, reject) => {
            // Save the primus client library configured for our server settings
            primus.save(path.join(__dirname, '../../client/components/socket/primus.js'), err => {
                if(err) return reject(err);

                resolve(primus);
            });
        });
    } else {
        return Promise.resolve(primus);
    }
}
