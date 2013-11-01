'use strict';

describe('Service: <%= classedName %>', function () {

  // load the service's module
  beforeEach(module('<%= scriptAppName %>App'));

  // instantiate service
  var <%= classedName %>;
  beforeEach(inject(function (_<%= classedName %>_) {
    <%= classedName %> = _<%= classedName %>_;
  }));

  it('should do something', function () {
    expect(!!<%= classedName %>).toBe(true);
  });

});
