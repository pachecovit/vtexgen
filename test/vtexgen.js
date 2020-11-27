'use strict';
var spawn = require('child_process').spawn,
    path = require('path');

describe('vtexgen', function () {
  it('should list installed generators', function (done) {
    var vtexgen = runVtexgen();
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(0);
      data.should.match(/\[vtexgen\] ├── bad/);
      data.should.match(/\[vtexgen\] └── test/);
      done();
    });
  });

  it('should list tasks for given generator', function (done) {
    var vtexgen = runVtexgen(['test', '--tasks']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(0);
      data.should.match(/├── default/);
      data.should.match(/└── app/);
      done();
    });
  });

  it('should run `default` task in generator, when task is not provided', function (done) {
    var vtexgen = runVtexgen(['test']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(0);
      data.should.match(/\ndefault\n/);
      done();
    });
  });

  it('should run provided task in generator', function (done) {
    var vtexgen = runVtexgen(['test:app']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(0);
      data.should.match(/\napp\n/);
      done();
    });
  });

  it('should run provided task with arguments in generator', function (done) {
    var vtexgen = runVtexgen(['test:app', 'arg1', 'arg2']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(0);
      data.should.match(/\napp \(arg1, arg2\)\n/);
      done();
    });
  });

  it('should fail when running a non-existing task in a generator', function (done) {
    var vtexgen = runVtexgen(['test:noexist']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(1);
      data.should.match(/\[vtexgen\] Task 'noexist' was not defined in `vtexgen-test`/);
      done();
    });
  });

  it('should fail when running a generator without vtexgenfile', function (done) {
    var vtexgen = runVtexgen(['bad']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(1);
      data.should.match(/\[vtexgen\] No vtexgenfile found/);
      data.should.match(/\[vtexgen\].+issue with.+`vtexgen-bad`/);
      done();
    });
  });

  it('should fail trying to run a non-existing generator', function (done) {
    var vtexgen = runVtexgen(['noexist']);
    var data = '';
    vtexgen.stdout.on('data', function (chunk) {
      data += chunk;
    });
    vtexgen.on('close', function (code) {
      code.should.equal(1);
      data.should.match(/\[vtexgen\] No generator by name: "noexist" was found/);
      done();
    });
  });
});

function runVtexgen (args) {
  args = args || [];
  var vtexgen = spawn('node', [path.join(__dirname, '..', 'bin', 'vtexgen.js')].concat(args), {cwd: __dirname});
  vtexgen.stdout.setEncoding('utf8');
  return vtexgen;
}
