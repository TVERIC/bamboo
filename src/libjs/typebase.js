"use strict";
var buffer_1 = require("../lib/buffer");
var Type = (function () {
    function Type() {
        this.size = 1;
    }
    Type.define = function (size, unpack, pack) {
        var new_type = new Type;
        new_type.size = size;
        new_type.unpackF = unpack;
        new_type.packF = pack;
        return new_type;
    };
    Type.prototype.unpack = function (buf, offset) {
        if (offset === void 0) { offset = 0; }
        return this.unpackF.call(buf, offset);
    };
    Type.prototype.pack = function (data, buf, offset) {
        if (offset === void 0) { offset = 0; }
        if (!buf)
            buf = new buffer_1.Buffer(this.size);
        if (data instanceof buffer_1.Buffer)
            data.copy(buf, offset);
        else if (typeof data == 'object')
            data.toBuffer().copy(buf, offset);
        else
            this.packF.call(buf, data, offset);
        return buf;
    };
    return Type;
}());
exports.Type = Type;
var Arr = (function () {
    function Arr() {
    }
    Arr.define = function (type, len) {
        var new_arr = new Arr;
        new_arr.len = len;
        new_arr.type = type;
        new_arr.size = type.size * len;
        return new_arr;
    };
    Arr.prototype.unpack = function (buf, offset) {
        if (offset === void 0) { offset = 0; }
        var arr = [], off;
        for (var i = 0; i < this.len; i++) {
            off = offset + (i * this.type.size);
            arr.push(this.type.unpack(buf, off));
        }
        return arr;
    };
    Arr.prototype.pack = function (data, buf, offset) {
        if (offset === void 0) { offset = 0; }
        if (!buf)
            buf = new buffer_1.Buffer(this.size);
        if (data) {
            var off;
            for (var i = 0; (i < this.len) && (i < data.length); i++) {
                off = offset + (i * this.type.size);
                this.type.pack(data[i], buf, off);
            }
        }
        return buf;
    };
    return Arr;
}());
exports.Arr = Arr;
var Struct = (function () {
    function Struct() {
        this.defs = [];
        this.size = 0;
    }
    Struct.define = function (size, defs) {
        var new_struct = new Struct;
        new_struct.size = size;
        new_struct.defs = defs;
        return new_struct;
    };
    Struct.prototype.unpack = function (buf, offset) {
        if (offset === void 0) { offset = 0; }
        var result = {};
        for (var _i = 0, _a = this.defs; _i < _a.length; _i++) {
            var field = _a[_i];
            var off = field[0], type = field[1], name = field[2];
            result[name] = type.unpack(buf, offset + off);
        }
        return result;
    };
    Struct.prototype.pack = function (data, buf, offset) {
        if (offset === void 0) { offset = 0; }
        if (!buf)
            buf = new buffer_1.Buffer(this.size);
        for (var _i = 0, _a = this.defs; _i < _a.length; _i++) {
            var field = _a[_i];
            var off = field[0], type = field[1], name = field[2];
            type.pack(data[name], buf, offset + off);
        }
        return buf;
    };
    return Struct;
}());
exports.Struct = Struct;
