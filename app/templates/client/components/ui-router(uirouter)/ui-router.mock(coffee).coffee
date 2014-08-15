'use strict'

angular.module 'stateMock', []
angular.module('stateMock').service '$state', ($q) ->
  @expectedTransitions = []

  @transitionTo = (stateName) ->
    if @expectedTransitions.length > 0
      expectedState = @expectedTransitions.shift()
      throw Error('Expected transition to state: ' + expectedState + ' but transitioned to ' + stateName)  if expectedState isnt stateName
    else
      throw Error('No more transitions were expected! Tried to transition to ' + stateName)
    console.log 'Mock transition to: ' + stateName
    deferred = $q.defer()
    promise = deferred.promise
    deferred.resolve()
    promise

  @go = @transitionTo

  @expectTransitionTo = (stateName) ->
    @expectedTransitions.push stateName

  @ensureAllTransitionsHappened = ->
    throw Error('Not all transitions happened!')  if @expectedTransitions.length > 0
  @
