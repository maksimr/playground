describe('foo', function() {
  beforeEach(angular.mock.module(
    require('./index').name
  ));


  var foo;
  beforeEach(inject(function(_foo_) {
    foo = _foo_;
  }));


  it('should be A', function() {
    expect(foo()).toEqual('A');
  });
});