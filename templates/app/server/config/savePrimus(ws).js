process.env.NODE_ENV = process.env.NODE_ENV || 'development';

require('babel-register');

const Primus = require('primus');
const primusEmit = require('primus-emit');
const express = require('express');
const http = require('http');
const path = require('path');

const server = http.createServer(express());
const primus = new Primus(server, {
    transformer: 'uws',
});
primus.plugin('emit', primusEmit);
primus.save(path.join(__dirname, '../../', 'client/components/socket/primus.js'), err => {
    if(err) {
        console.error(err);
        process.exit(1);
    } else {
        process.exit(0);
    }
});
