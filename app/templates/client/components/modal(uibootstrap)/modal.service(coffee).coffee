'use strict'

angular.module '<%= scriptAppName %>'
.factory 'Modal', ($rootScope, $modal) ->
  
  ###
  Opens a modal
  @param  {Object} scope      - an object to be merged with modal's scope
  @param  {String} modalClass - (optional) class(es) to be applied to the modal
  @return {Object}            - the instance $modal.open() returns
  ###
  openModal = (scope, modalClass) ->
    modalScope = $rootScope.$new()
    scope = scope or {}
    modalClass = modalClass or 'modal-default'
    angular.extend modalScope, scope
    $modal.open
      templateUrl: 'components/modal/modal.html'
      windowClass: modalClass
      scope: modalScope

  
  # Public API here
  
  # Confirmation modals 
  confirm:
    
    ###
    Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
    @param  {Function} del - callback, ran when delete is confirmed
    @return {Function}     - the function to open the modal (ex. myModalFn)
    ###
    delete: (del) ->
      del = del or angular.noop
      
      ###
      Open a delete confirmation modal
      @param  {String} name   - name or info to show on modal
      @param  {All}           - any additional args are passed staight to del callback
      ###
      ->
        args = Array::slice.call arguments
        name = args.shift()
        deleteModal = undefined
        deleteModal = openModal(
          modal:
            dismissable: true
            title: 'Confirm Delete'
            html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>'
            buttons: [
              {
                classes: 'btn-danger'
                text: 'Delete'
                click: (e) ->
                  deleteModal.close e
                  return
              }
              {
                classes: 'btn-default'
                text: 'Cancel'
                click: (e) ->
                  deleteModal.dismiss e
                  return
              }
            ]
        , 'modal-danger')
        deleteModal.result.then (event) ->
          del.apply event, args
          return

        return
