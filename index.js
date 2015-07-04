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
}

Frame.prototype.write = function (buf) {
    if (typeof buf === 'string') buf = Buffer(buf);
    else if (!Buffer.isBuffer(buf)) buf = Buffer(String(buf));
    if (buf.length) this._queue.push(buf);
};

Frame.prototype.read = function (n) {
    var output = new Buffer(n);
    var buf = this._queue[0];
    var prev = 0;
    
    for (var i = 0; i < n; i++) {
        if (!buf) {
            output[i] = 255; // fill with stop bits when the queue is empty
            continue;
        }
        if (i % 5 === 4) {
            output[i] = (buf[this._index] >> 1) % 128 + 127;
        }
        else {
            var p = (i % 5) * 2 + 1;
            output[i] = (buf[this._index] << p) % 256 + prev >> (p+1);
        }
        prev = buf[this._index];
        this._index++;
        if (this._index >= buf.length) {
            this._index = 0;
            this._queue.shift();
            buf = this._queue[0];
        }
    }
    return output;
};
