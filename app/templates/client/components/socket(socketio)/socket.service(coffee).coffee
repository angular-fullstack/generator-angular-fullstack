# global io 

'use strict'

angular.module('<%= scriptAppName %>').factory 'socket', (socketFactory) ->
  retryInterval = 5000
  retryTimer = undefined
  clearInterval retryTimer
  ioSocket = io.connect('',
    'force new connection': true
    'max reconnection attempts': Infinity
    'reconnection limit': 10 * 1000
  )
  
  # Send auth token on connection
  # 'query': 'token=' + Auth.getToken()
  retryTimer = setInterval(->
    ioSocket.connect()  if not ioSocket.socket.connected and not ioSocket.socket.connecting and not ioSocket.socket.reconnecting
  , retryInterval)
  socket = socketFactory(ioSocket: ioSocket)
  socket: socket
  
  ###
  Register listeners to sync a collection with socket.io
  ###
  syncCollection: (collection, itemName) ->
    
    ###
    Syncs item creation/updates on 'model:save'
    ###
    socket.on itemName + ':save', (newItem) ->
      oldItem = _.find(collection,
        _id: newItem._id
      )
      index = collection.indexOf(oldItem)
      
      # replace oldItem if it exists
      # otherwise just add newItem to the collection
      if oldItem
        collection.splice index, 1, newItem
      else
        collection.push newItem
    
    ###
    Syncs removed items on 'model:remove'
    ###
    socket.on itemName + ':remove', (newItem) ->
      _.remove collection,
        _id: newItem._id