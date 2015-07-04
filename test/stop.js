var test = require('tape');
var packer = require('../');

test('2 stop bits for two bytes', function (t) {
    var p = packer({ stop: 2 });
    p.write(Buffer([ parseInt('11011011', 2), parseInt('01110010', 2) ]));
    var out = p.read(3);
    t.equal(bin(out), '0' + '11011011' + '110' + '01001110' + '1111');
    t.end();
});

test('3 stop bits for two bytes', function (t) {
    var p = packer({ stop: 3 });
    p.write(Buffer([ parseInt('11011011', 2), parseInt('01110010', 2) ]));
    var out = p.read(3);
    t.equal(bin(out), '0' + '11011011' + '1110' + '01001110' + '111');
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
