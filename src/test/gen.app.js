'use strict';
import fs from 'fs';
import Promise from 'bluebird';
Promise.promisifyAll(fs);
import {runGen} from './test-helpers';

const TEST_DIR = __dirname;
const DEBUG = process.env.DEBUG || false;

let name = process.argv[2];
let options = JSON.parse(process.argv[3]);

// console.log(name);
// console.log(options);

runGen(name, options).then(dir => {
  process.send(dir);
});

// process.on('disconnect',function() {
// 	process.kill();
// });
