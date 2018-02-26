process.env.NODE_ENV = 'development';

require('babel-register');
const http = require('http');
const express = require('express');
const initWebSocketServer = require('./websockets').default;

initWebSocketServer(http.createServer(express())).then(() => {
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
