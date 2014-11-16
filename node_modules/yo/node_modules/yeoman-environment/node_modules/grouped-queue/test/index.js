var assert = require('assert');
var sinon = require('sinon');

var Queue = require('../lib/queue');
var SubQueue = require('../lib/subqueue');
var _ = require('lodash');

describe('Queue', function() {
  beforeEach(function() {
    var runOrder = this.runOrder = [];
    this.q = new Queue([ 'before', 'run', 'after' ]);
    this.task1 = function( cb ) { runOrder.push('task1'); cb(); };
    this.task2 = function( cb ) { runOrder.push('task2'); cb(); };
  });

  describe('Constructor', function() {
    it('create sub-queues', function() {
      assert( this.q.__queues__.before instanceof SubQueue );
      assert( this.q.__queues__.run instanceof SubQueue );
      assert( this.q.__queues__.after instanceof SubQueue );
    });

    it('create a default queue', function() {
      assert( this.q.__queues__.default instanceof SubQueue );
      assert.equal( _.last(Object.keys(this.q.__queues__)), 'default' );
    });

    it('allow redifining `default` queue position', function () {
      var queue = new Queue([ 'before', 'default', 'after' ]);
      assert.deepEqual( Object.keys(queue.__queues__), [ 'before', 'default', 'after' ]);
    });
  });

  describe('#add', function() {
    beforeEach(function() {
      this.runStub = sinon.stub( this.q, 'run' );
    });

    it('add task to a queue', function() {
      this.q.add( 'before', this.task1 );
      this.q.add( 'after', this.task2 );
      assert.equal( this.q.__queues__.before.shift().task, this.task1 );
      assert.equal( this.q.__queues__.after.shift().task, this.task2 );
    });

    it('default task in the default queue', function() {
      this.q.add( this.task1 );
      assert.equal( this.q.__queues__.default.shift().task, this.task1 );
    });

    it('calls run', function() {
      this.q.add( this.task1 );
      this.q.add( this.task2 );
      assert( this.runStub.called );
    });

    it('does not call run', function () {
      this.q.add('before', this.task1, { run: false });
      this.q.add('after', this.task2, { run: false });
      assert.equal( this.runStub.called, false );
    });

    it('only run named task one', function () {
      this.q.add(this.task1, { once: 'done' });
      this.q.add(this.task2, { once: 'done' });
      assert.equal( this.q.__queues__.default.__queue__.length, 1 );
    });
  });

  describe('#run', function() {
    it('run task in "First-in First-out" order', function() {
      this.q.add( this.task2 );
      this.q.add( this.task1 );
      this.q.once('end', function() {
        assert.equal( this.runOrder[0], 'task2' );
        assert.equal( this.runOrder[1], 'task1' );
      }.bind(this));
    });

    it('run async tasks', function( done ) {
      var counter = 0;
      this.q.add(function( cb ) {
        assert.equal( counter += 1, 1 );
        cb();
      });
      this.q.add(function( cb ) {
        assert.equal( counter += 1, 2 );
        done();
      });
    });

    it('run prioritized tasks first', function() {
      var stub = sinon.stub( this.q, 'run' );
      this.q.add( 'after', this.task2 );
      this.q.add( 'before', this.task1 );
      stub.restore();
      this.q.run();
      this.q.once('end', function() {
        assert.equal( this.runOrder[0], 'task1' );
        assert.equal( this.runOrder[1], 'task2' );
      }.bind(this));
    });

    it('always re-exec from the first queue down', function( done ) {
      this.q.add(function( cb ) {
        this.q.add( 'after', this.task1 );
        this.q.add( 'before', this.task2 );
        cb();
        this.q.once('end', function() {
          assert.equal( this.runOrder[0], 'task2' );
          assert.equal( this.runOrder[1], 'task1' );
        }.bind(this));
        done();
      }.bind(this));
    });

    it('run the queues explicitly after tasks are added', function( done ) {
      this.q.add( 'before', this.task1, { run: false })
      this.q.add( 'after', this.task2, { run: false });
      this.q.run();
      this.q.once('end', function() {
        assert.equal( this.runOrder[0], 'task1' );
        assert.equal( this.runOrder[1], 'task2' );
        done();
      }.bind(this));
    });

    it('emit `end` event once the queue is cleared.', function (done) {
      this.q.on('end', function () {
        done();
      });
      this.q.add( 'after', this.task1 );
    });
  });
});
