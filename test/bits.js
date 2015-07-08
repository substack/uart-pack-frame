var test = require('tape');
var packer = require('../');

test('read 3 of two bytes as bits', function (t) {
    var p = packer();
    p.write(Buffer([ parseInt('11011011', 2), parseInt('01110010', 2) ]));
    var out = p.readBits(24);
    t.deepEqual(out, bits('0' + '11011011' + '10' + '01001110' + '11111'));
    t.end();
});

function bits (str) { return str.split('').map(Number) }
