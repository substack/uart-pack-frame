var defined = require('defined');

// 8 bits, no parity, 1 stop bit
// [0abcdefg][h10abcde][fgh10abc][defgh10a][bcdefgh1]

module.exports = Frame;

function Frame (opts) {
    if (!(this instanceof Frame)) return new Frame(opts);
    if (!opts) opts = {};
    this._baud = defined(opts.baud, 300);
    this._invert = Boolean(opts.invert);
    this._queue = [];
    this._index = 0;
    this._prev = 0;
}

Frame.prototype.write = function (buf) {
    if (typeof buf === 'string') buf = Buffer(buf);
    else if (!Buffer.isBuffer(buf)) buf = Buffer(String(buf));
    if (buf.length) this._queue.push(buf);
};

Frame.prototype.read = function (n) {
    var output = new Buffer(n);
    var buf = this._queue[0];
    
    for (var i = 0; i < n; i++) {
        if (!buf && !this._prev) {
            output[i] = 255; // fill with stop bits when the queue is empty
            continue;
        }
        var b = buf ? buf[this._index] : 255;
        if (i % 5 === 4) {
            output[i] = (b >> 1) % 128 + 127;
        }
        else {
            var p = (i % 5) * 2 + 1;
            output[i] = (b << p) % 256 + (this._prev >> (p-2))
                + (i % 5 === 0 ? 0 : 1 << (p-1))
//                + (i % 5 === 0 ? 0 : 1 << (p+1))
            ;
        }
        this._prev = b;
        this._index++;
        if (buf && this._index >= buf.length) {
            this._index = 0;
            this._queue.shift();
            buf = this._queue[0];
        }
    }
    return output;
};
