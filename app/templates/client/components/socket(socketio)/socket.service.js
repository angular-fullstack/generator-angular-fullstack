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
       * Register listeners to sync a collection with socket.io
       */
      syncCollection: function(collection, itemName) {

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(itemName + ':save', function(newItem) {
          var oldItem = _.find(collection, { _id: newItem._id });
          var index = collection.indexOf(oldItem);

          // replace oldItem if it exists
          // otherwise just add newItem to the collection
          if(oldItem) {
            collection.splice(index, 1, newItem);
          } else {
            collection.push(newItem);
          }
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(itemName + ':remove', function(newItem) {
          _.remove(collection, { _id: newItem._id });
        });
      }
    };
  });