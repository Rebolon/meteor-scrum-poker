var assert = require('assert');

suite('List', function() {

  test('in the server', function(done, server) {

    server.eval(function() {

      Meeting.insert({title: 'test meeting from laika', ownerId: 'YHrQDiYZuaw2M6PT2', submitted: 1371563680354});
      var list = Meeting.find().fetch();
      emit('list', list);

    });

    server.once('list', function(list) {

      assert.equal(list.length, 1);
      done();

    });

  });
});
