
class IndexedRecord {
    oldCount: number = 0
    newCount: number = 0
    indexes: Array<number> = []
}

class Change<T> {
    from: number = 0
    to: number = 0
    value?: T
    constructor(from: number, to: number, value: T) {
        this.from = from
        this.to = to
        this.value = value
    }
}

class MoveDiff {

    src: Array<String> = []
    dest: Array<String> = []
    constructor(src: String, dest: String) {
        this.src = src.split('')
        this.dest = dest.split('')
    }

    private map = new Map<String, IndexedRecord>()

    getRecord(key: String): IndexedRecord {
        var r = this.map.get(key)
        if (r == undefined) {
            r = new IndexedRecord()
            this.map.set(key, r)
        }
        return r
    }

    inserts: Array<Change<String>> = []
    delete: Array<Change<String>> = []
    move: Array<Change<String>> = []

    check() {
        // - 遍历目标，保存记录
        this.dest.forEach((v, i, a) => {
            let r = this.getRecord(v)
            r.newCount += 1
            // 新数据，表示没有位置
            r.indexes.push(-1)
        })

        // - 反向遍历源数据，并记录相应位置
        if (this.src.length > 0) {
            for (var i = this.src.length - 1; i >= 0; i--) {
                let c = this.src[i]
                let r = this.getRecord(c)
                r.oldCount += 1
                r.indexes.push(i)
            }
        }

        // - 遍历数据，构造Change
        this.dest.forEach((v, i, a) => {
            let r = this.getRecord(v)
            let index = r.indexes.pop()!
            if (index < 0) {
                // 表示旧数据中没有，属于新增
                this.inserts.push(new Change(0, i, v))
            } else if (index != i) {
                // } else {
                // 表示旧数据中有，属于move
                this.move.push(new Change(index, i, v))
            }
        })

        this.src.forEach((v, i, a) => {
            let r = this.getRecord(v)
            let index = r.indexes.pop()!
            if (index >= 0) {
                // 表示新数据没有，属于删除
                this.delete.push(new Change(0, i, v))
            }
        })
    }
}

var a = "ABCDEFT"
var b = "ACDEHL"

let diff = new MoveDiff(a, b)
let s = new Date().getMilliseconds()
diff.check()
let e = new Date().getMilliseconds()


console.log("-----insert")
diff.inserts.forEach((v, i, a) => {
    console.log(`${v.to}: ${v.value}`)
})
console.log("-----delete")
diff.delete.forEach((v, i, a) => {
    console.log(`${v.to}: ${v.value}`)
})
console.log("-----move")
diff.move.forEach((v, i, a) => {
    console.log(`${v.value}: ${v.from} -> ${v.to}`)
})

console.log(`cost: ${e - s} ms`)