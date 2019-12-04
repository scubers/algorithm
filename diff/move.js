var IndexedRecord = /** @class */ (function () {
    function IndexedRecord() {
        this.oldCount = 0;
        this.newCount = 0;
        this.indexes = [];
    }
    return IndexedRecord;
}());
var Change = /** @class */ (function () {
    function Change(from, to, value) {
        this.from = 0;
        this.to = 0;
        this.from = from;
        this.to = to;
        this.value = value;
    }
    return Change;
}());
var MoveDiff = /** @class */ (function () {
    function MoveDiff(src, dest) {
        this.src = [];
        this.dest = [];
        this.map = new Map();
        this.inserts = [];
        this["delete"] = [];
        this.move = [];
        this.src = src.split('');
        this.dest = dest.split('');
    }
    MoveDiff.prototype.getRecord = function (key) {
        var r = this.map.get(key);
        if (r == undefined) {
            r = new IndexedRecord();
            this.map.set(key, r);
        }
        return r;
    };
    MoveDiff.prototype.check = function () {
        var _this = this;
        // - 遍历目标，保存记录
        this.dest.forEach(function (v, i, a) {
            var r = _this.getRecord(v);
            r.newCount += 1;
            // 新数据，表示没有位置
            r.indexes.push(-1);
        });
        // - 反向遍历源数据，并记录相应位置
        if (this.src.length > 0) {
            for (var i = this.src.length - 1; i >= 0; i--) {
                var c = this.src[i];
                var r = this.getRecord(c);
                r.oldCount += 1;
                r.indexes.push(i);
            }
        }
        // - 遍历数据，构造Change
        this.dest.forEach(function (v, i, a) {
            var r = _this.getRecord(v);
            var index = r.indexes.pop();
            if (index < 0) {
                // 表示旧数据中没有，属于新增
                _this.inserts.push(new Change(0, i, v));
            }
            else if (index != i) {
                // } else {
                // 表示旧数据中有，属于move
                _this.move.push(new Change(index, i, v));
            }
        });
        this.src.forEach(function (v, i, a) {
            var r = _this.getRecord(v);
            var index = r.indexes.pop();
            if (index > 0) {
                // 表示新数据没有，属于删除
                _this["delete"].push(new Change(0, i, v));
            }
        });
    };
    return MoveDiff;
}());
var a = "abcdeft";
var b = "acdehl";
var diff = new MoveDiff(a, b);
var s = new Date().getMilliseconds();
diff.check();
var e = new Date().getMilliseconds();
console.log("-----insert");
diff.inserts.forEach(function (v, i, a) {
    console.log(v.to + ": " + v.value);
});
console.log("-----delete");
diff["delete"].forEach(function (v, i, a) {
    console.log(v.to + ": " + v.value);
});
console.log("-----move");
diff.move.forEach(function (v, i, a) {
    console.log(v.value + ": " + v.from + " -> " + v.to);
});
console.log("cost: " + (e - s) + " ms");
