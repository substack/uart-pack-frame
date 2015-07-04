# uart-pack-frame

pack data in the
[UART](https://en.wikipedia.org/wiki/Universal_asynchronous_receiver/transmitter#Data_framing)
format used for serial communication

# example

``` js
var packer = require('uart-pack-frame');

var p = packer();
p.write('abcdefg');
console.log(p.read(10));
```

# api

``` js
var packer = require('uart-pack-frame');
```

## var p = packer(opts)

Create a pack instance `p`.

* `opts.stop` - number of stop bits. default: 1

Presently unconfigurable options: 8 bits, no parity.

## p.write(buf)

Write `buf` to the packer.

## var buf = p.read(n)

Read `n` bytes of framed data into a buffer `buf`.

If all the written data has been read, `buf` is padded with trailing stop bits.

## var bits = p.readBits(n)

Read `n` bits of framed data into `bits`, an array of 0s and 1s.

If all the written data has been read, `bits` is padded with trailing stop bits
(1s).

# install

With [npm](https://npmjs.org) do:

```
npm install uart-pack-frame
```

# license

MIT
