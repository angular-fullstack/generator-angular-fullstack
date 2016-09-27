'use strict';

export function SocketService() {
  return {
    socket: {
      connect: function() {},
      on: function() {},
      emit: function() {},
      receive: function() {}
    },

    syncUpdates: function() {},
    unsyncUpdates: function() {}
  };
}
