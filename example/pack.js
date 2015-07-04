var packer = require('../');

var p = packer();
p.write('abcdefg');
console.log(p.read(10));
