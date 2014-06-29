/* global io */
'use strict';

angular.module('<%= scriptAppName %>')
  .factory('socket', function(socketFactory) {
    var retryInterval = 5000;
    var retryTimer;

    clearInterval(retryTimer);

    var ioSocket = io.connect('', {
      'force new connection': true,

      'max reconnection attempts': Infinity,

      'reconnection limit': 10 * 1000,

      // Send auth token on connection
      // 'query': 'token=' + Auth.getToken()
    });

    retryTimer = setInterval(function () {
      if (!ioSocket.socket.connected &&
          !ioSocket.socket.connecting &&
          !ioSocket.socket.reconnecting) {
        ioSocket.connect();
      }
    }, retryInterval);

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

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
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (newItem) {
          var oldItem = _.find(array, {_id: newItem._id});
          var index = array.indexOf(oldItem);

          // replace oldItem if it exists
          // otherwise just add newItem to the collection
          if (oldItem) {
            array.splice(index, 1, newItem);
          } else {
            array.push(newItem);
          }

          cb(array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (newItem) {
          _.remove(array, {_id: newItem._id});
          cb(array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });