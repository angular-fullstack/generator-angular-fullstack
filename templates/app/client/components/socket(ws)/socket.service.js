'use strict';
import Primus from './primus';
import primusEmit from 'primus-emit';
import { Injectable } from '@angular/core';
import { noop, find, remove } from 'lodash';

@Injectable()
export class SocketService {
  primus;

  constructor() {
    const primus = Primus.connect();
    primus.plugin('emit', primusEmit);

    primus.on('open', function open() {
      console.log('Connection opened');
    });

    if(process.env.NODE_ENV === 'development') {
      primus.on('data', function message(data) {
        console.log('Socket:', data);
      });
    }

    primus.on('info', data => {
      console.log('info:', data);
    });

    this.primus = primus;
  }

  /**
   * Register listeners to sync an array with updates on a model
   *
   * Takes the array we want to sync, the model name that socket updates are sent from,
   * and an optional callback function after new items are updated.
   *
   * @param {String} modelName
   * @param {Array} array
   * @param {Function} cb
   */
  syncUpdates(modelName, array, cb = noop) {
    /**
     * Syncs item creation/updates on 'model:save'
     */
    this.primus.on(`${modelName}:save`, item => {
      console.log(item);
      let oldItem = find(array, {_id: item._id});
      let index = array.indexOf(oldItem);
      let event = 'created';

      // replace oldItem if it exists
      // otherwise just add item to the collection
      if(oldItem) {
        array.splice(index, 1, item);
        event = 'updated';
      } else {
        array.push(item);
      }

      cb(event, item, array);
    });

    /**
     * Syncs removed items on 'model:remove'
     */
    this.primus.on(`${modelName}:remove`, item => {
      remove(array, {_id: item._id});
      cb('deleted', item, array);
    });
  }

  /**
   * Removes listeners for a models updates on the socket
   *
   * @param modelName
   */
  unsyncUpdates(modelName) {
    this.primus.removeAllListeners(`${modelName}:save`);
    this.primus.removeAllListeners(`${modelName}:remove`);
  }
}
