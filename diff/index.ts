
class ActionNode {
    action: string = ""
    value: string = ""
    index: number = 0
    constructor(action: string, value: string, idx: number) {
        this.action = action
        this.value = value
        this.index = idx
    }
    getDesc(): string {
        let s = `${this.index}: ${this.action} ${this.value}\n`
        if (this.parent == undefined) {
            return s
        }
        return this.parent.getDesc() + s
    }
    getCount(): number {
        if (this.parent == undefined) {
            return 1
        }
        return this.parent.getCount() + 1
    }
    getActionCount(): number {
        var steps = 0
        if (this.action != " ") {
            steps += 1
        }
        var last = this.parent
        while (last != undefined) {
            if (last.action != " ") {
                steps += 1
            }
            last = last.parent
        }
        return steps
    }
    parent?: ActionNode
}

class Diff {

    constructor(src: string, dest: string) {
        this.src = src
        this.dest = dest
    }
    // 原始
    src: string
    // 编辑后
    dest: string

    check(): number {

        if (src == dest) { return 100 }

        var point = 100
        var modifySteps = 0

        let sourceCount = src.length
        let destCount = dest.length

        let srcArray = this.src.split("")
        let destArray = this.dest.split("")

        // 记录操作，方便回溯
        // let actions = new Array<ActionNode>()
        let actions = new Map<string, ActionNode>()

        // 保存对应 k 上的 x 值
        let map = new Map<number, number>()
        // 初始化 0 步操作的时候，所在的 x 值为0
        map.set(0, 0)
        // 最多执行 n + m 步后能完成更改，所以从小到大开始遍历可能的步数
        out: for (var d = 1; d < sourceCount + destCount; d++) {
            // console.log(`===============loop d: ${d}`)
            /**
             * 设 k = x - y，最优的编辑方案是优先删除，后增加。
             * 所以 x 大，则删除得多。
             * 对可能取值的k进行遍历，因为默认移动不能进行对角线移动，只能x或者y移动，
             * 导致 k = x - y，的跨度为 2，
             * 对跨度为2的k值进行遍历
             */
            for (var k = d; k >= -d; k -= 2) {
                // console.log(`k: ${k}`)
                /**
                 * 1,每次迭代都需要从上次迭代保存的值开始计算
                 * 2,因为每次行走路径我们只需要记录一个最优路径，所以每个非边界点，都有可能从 上 或者 左 而来
                 * 3,判断使用 上 还是 左 的逻辑，我们优先使用已经优先删除较多的元素的路径
                 */

                let lastK: number
                if (k == -d) {
                    // 必须从 k + 1 到达
                    lastK = k + 1
                } else if (k == d) {
                    // 必须从 k - 1 到达
                    lastK = k - 1
                } else {
                    /**
                     * 1,这里非边界值时，可以从 k + 1, k - 1到达，选用 x 较大的值
                     * 2,若 x 相等，则选用 k - 1，因为选择 k 值小，所以 y 值大，意味着在删除相等个数的情况下，y值大证明已经添加了较多的元素
                     */
                    if (map.get(k + 1)! == map.get(k - 1)!) {
                        lastK = k - 1
                    } else {
                        lastK = map.get(k + 1)! > map.get(k - 1)! ? k + 1 : k - 1
                    }
                }
                // 只有 k + 1 的情况使从上往下执行
                var fromTop = lastK == (k + 1)

                var x = map.get(lastK)!
                var y = x - lastK
                var parent = actions.get(`${x}${y}`)
                var action: ActionNode
                if (fromTop) {
                    action = new ActionNode("+", destArray[y], d)
                    modifySteps += 1
                    y += 1
                } else {
                    action = new ActionNode("-", srcArray[x], d)
                    modifySteps += 1
                    x += 1
                }
                if (parent != undefined) {
                    action.parent = parent
                    action.index = parent.index + 1
                }
                actions.set(`${x}${y}`, action)
                var lastAction = action
                // 如果存在下一个字符相同，则xy都 + 1，形成对角线
                while (y < destCount && x < sourceCount && srcArray[x] == destArray[y]) {
                    let ac = new ActionNode(" ", destArray[y], lastAction.index + 1)
                    x += 1
                    y += 1
                    ac.parent = lastAction
                    lastAction = ac
                    actions.set(`${x}${y}`, ac)
                }

                // 保存当前 k 下的 x 值
                // console.log(`current: (${x}, ${y})\n`)
                map.set(k, x)

                if (y == destCount && x == sourceCount) {
                    // 找到答案
                    console.log(`>>>>>>>>>>>>>>>>>>>>>>>> d: ${d}`)
                    console.log(actions.size)
                    let total = sourceCount + destCount
                    console.log(`total: ${total}`)
                    console.log(`step: ${lastAction.getActionCount()}`)
                    point = 1 - lastAction.getActionCount() / total
                    // console.log(actions.get(`${x}${y}`)!.getDesc())
                    // console.log(actions.map((v, a, b) => { return v.getDesc() }).join(","))
                    break out
                }

            }

        }
        return point

    }

}

// var src = "ABCABBA"
// var dest = "CBABAC"
var src = "绝对零度～未然犯罪潜入搜查～.Zettai.Reido.Mizen.Hanzai.Sennyu.Sousa.Ep02.Chi_Jap.HDTVrip.1280X720-ZhuixinFanV2.mp4"
var dest = "绝对零度～未然犯罪潜入搜查～.Zettai.Reido.Mizen.Hanzai.Sennyu.Sousa.Ep04.Chi_Jap.HDTVrip.1280X720-ZhuixinFan.mp4"
let start = new Date().getMilliseconds()
let point = new Diff(src, dest).check()
let end = new Date().getMilliseconds()
console.log(`耗时：${(end - start) / 1000.0}`)
console.log(`point: ${point}`)