var test = require('tape');
var packer = require('../');

test('read 2 of a single byte', function (t) {
    var p = packer();
    p.write(Buffer([ parseInt('10101', 2) ]));
    var out = p.read(2);
    t.equal(bin(out), '0' + '10101000' + '1' + '111111');
    t.end();
});

test('read 3 of a single byte', function (t) {
    var p = packer();
    p.write(Buffer([ parseInt('10101', 2) ]));
    var out = p.read(3);
    t.equal(bin(out), '0' + '10101000' + '1' + '111111' + '11111111');
    t.end();
});

test('read 3 of two bytes', function (t) {
    var p = packer();
    p.write(Buffer([ parseInt('11011011', 2), parseInt('01110010', 2) ]));
    var out = p.read(3);
    t.equal(bin(out), '0' + '11011011' + '10' + '01001110' + '11111');
    t.end();
});

function zpad (n, s) { return Array(n+1-s.length).join('0') + s }
function bin (buf) { // least-significant bit first
    var s = '';
    for (var i = 0; i < buf.length; i++) {
        s += zpad(8, buf[i].toString(2)).split('').reverse().join('');
    }
    return s;
}
