var test = require('tape');
var packer = require('../');

test('write a string', function (t) {
    var p = packer();
    p.write('ABC');
    var out = p.readBits(34);
    t.deepEqual(out, bits('0' + '10000010' + '10' + '01000010'
        + '10' + '11000010' + '1'
        + '1111'
    ));
    t.end();
});

function bits (str) { return str.split('').map(Number) }
