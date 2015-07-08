var test = require('tape');
var packer = require('../');

test('write a number', function (t) {
    var p = packer();
    p.write(123);
    var out = p.readBits(34);
    t.deepEqual(out, bits('0' + '10001100' + '10' + '01001100'
        + '10' + '11001100' + '1'
        + '1111'
    ));
    t.end();
});

function bits (str) { return str.split('').map(Number) }
