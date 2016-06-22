'use strict';
import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import {runEndpointGen} from './test-helpers';

const TEST_DIR = __dirname;
const DEBUG = process.env.DEBUG || false;

let name = process.argv[2];
let options = JSON.parse(process.argv[3]);
let dir = process.argv[4];

// console.log(name);
// console.log(options);
// console.log(dir);

process.chdir(dir);

runEndpointGen(name, options).then(dir => {
  process.send('done');
});

// process.on('disconnect',function() {
// 	process.kill();
// });
