
class Diff1 {

    constructor(src: string, dest: string) {
        this.src = src
        this.dest = dest
    }
    // 原始
    src: string
    // 编辑后
    dest: string

    check() {

        let sourceCount = src.length
        let destCount = dest.length

        let srcArray = this.src.split("")
        let destArray = this.dest.split("")

        // 保存对应 k 上的 x 值
        let map = new Map<number, number>()
        // 初始化 0 步操作的时候，所在的 x 值为0
        map.set(0, 0)
        // 最多执行 n + m 步后能完成更改，所以从小到大开始遍历可能的步数
        out: for (var d = 1; d < sourceCount + destCount; d++) {
            console.log(`===============loop d: ${d}`)
            /**
             * 设 k = x - y，最优的编辑方案是优先删除，后增加。
             * 所以 x 大，则删除得多。
             * 对可能取值的k进行遍历，因为默认移动不能进行对角线移动，只能x或者y移动，
             * 导致 k = x - y，的跨度为 2，
             * 对跨度为2的k值进行遍历
             */
            for (var k = -d; k <= d; k += 2) {
                console.log(`k: ${k}`)
                // 每次迭代都需要从上次迭代保存的值开始计算
                var lastX: number
                var lastY: number
                var newX: number
                var newY: number
                var fromTop: boolean
                if (k == -d) {
                    // 必须从 k + 1 到达
                    lastX = map.get(k + 1)!
                    lastY = lastX - (k + 1)
                    fromTop = true
                } else if (k == d) {
                    // 其他遍历都可从 k - 1 到达
                    lastX = map.get(k - 1)!
                    lastY = lastX - (k - 1)
                    fromTop = false
                } else {
                    //
                    var topX = map.get(k + 1)!
                    var topY = topX - (k + 1)

                    var leftX = map.get(k - 1)!
                    var lfetY = leftX - (k - 1)

                    if (topX != leftX) {
                        // 如果x不一样，取x较大的，因为已经优先删除了较多的元素
                        if (topX > leftX) {
                            lastX = topX
                            lastY = topY
                            fromTop = true
                        } else {
                            lastX = leftX
                            lastY = lfetY
                            fromTop = false
                        }
                    } else {
                        // x 一样取y较大的，因为已经优先添加了较多的元素
                        if (topY > lfetY) {
                            lastX = topX
                            lastY = topY
                            fromTop = true
                        } else {
                            lastX = leftX
                            lastY = lfetY
                            fromTop = false
                        }
                    }

                }

                console.log(`pre (${lastX}, ${lastY})`)
                var x = lastX
                var y = lastY
                if (fromTop) {
                    y += 1
                } else {
                    x += 1
                }
                // 如果存在下一个字符相同，则xy都 + 1，形成对角线
                while ( y < destCount && x < sourceCount && srcArray[x] == destArray[y]) {
                    console.log("----------------------------------------")
                    x += 1
                    y += 1
                }

                if (y == destCount && x == sourceCount) {
                    // 找到答案
                    console.log(`>>>>>>>>>>>>>>>>>>>>>>>> d: ${d}`)
                    break out
                }
                // 保存当前 k 下的 x 值
                console.log(`current: (${x}, ${y})\n`)
                map.set(k, x)

            }


        }
        
    }

}

var src = "ABCABBA"
var dest = "CBABAC"
let start1 = new Date().getMilliseconds()
new Diff1(src, dest).check()
let end1 = new Date().getMilliseconds()
console.log(`耗时：${(end1 - start1) / 1000.0}`)