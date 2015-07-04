// 8 bits, no parity, 1 stop bit
// [0abcdefg][h10abcde][fgh10abc][defgh10a][bcdefgh1]

module.exports = Frame;

function Frame (opts) {
    if (!(this instanceof Frame)) return new Frame(opts);
    if (!opts) opts = {};
    this._stop = opts.stop === undefined ? 1 : opts.stop;
    
    this._queue = [];
    this._index = 0;
    this._bits = [];
}

Frame.prototype.write = function (buf) {
    if (typeof buf === 'string') buf = Buffer(buf);
    else if (!Buffer.isBuffer(buf)) buf = Buffer(String(buf));
    if (buf.length) this._queue.push(buf);
};

Frame.prototype.read = function (n) {
    var buf = this._queue[0];
    var bits = this._bits;
    while (bits.length / 8 < n) {
        if (!buf) {
            bits.push(1);
            continue;
        }
        var b = buf[this._index++];
        bits.push(
            0, // start bit
            (b >> 0) % 2,
            (b >> 1) % 2,
            (b >> 2) % 2,
            (b >> 3) % 2,
            (b >> 4) % 2,
            (b >> 5) % 2,
            (b >> 6) % 2,
            (b >> 7) % 2
        );
        for (var j = 0; j < this._stop; j++) {
            bits.push(1); // stop bit(s)
        }
        
        if (this._index >= buf.length) {
            this._queue.shift();
            buf = this._queue[0];
        }
    }
    var output = new Buffer(n);
    for (var i = 0; i < n; i++) {
        output[i] = 0
            + (bits[i*8+0]<<0)
            + (bits[i*8+1]<<1)
            + (bits[i*8+2]<<2)
            + (bits[i*8+3]<<3)
            + (bits[i*8+4]<<4)
            + (bits[i*8+5]<<5)
            + (bits[i*8+6]<<6)
            + (bits[i*8+7]<<7)
        ;
    }
    bits.splice(0, n*8);
    return output;
};
