

/**
 * 检验数公式：theta = Cj - Cb * B逆 pj 选择检验数最大的进行进基
 * - 若所有检验数都 <= 0, 则为最优解
 * 检验比：theta = (B逆 * b) / (B逆 * p) 相当于 b / p 选择最小的进行出基
 * 交叉元进行初等行变化化为1, 然后其他行消成0
 */

class Simplex {
    matrix: Array<Array<number>>

    c: Array<number>

    totalRow: number
    totalCol: number
    baseCol: Array<number>
    constructor(matrix: Array<Array<number>>) {
        
        // this.baseCol = [3,4,5]
        // 构造矩阵的前提是，矩阵除了第一行之外，一定要含有单位矩阵
        // this.matrix = [
        //     [0,7,12,0,0,0],
        //     [360,9,4,1,0,0],
        //     [200,4,5,0,1,0],
        //     [300,3,10,0,0,1],
        // ]
        this.matrix = matrix

        this.c = this.matrix[0]

        this.totalRow = this.matrix.length
        this.totalCol = this.c.length

        // this.printMatrix()
        let begin = new Date()
        this.start()
        let end = new Date()
        console.log(`cost: ${end.getMilliseconds() - begin.getMilliseconds()}ms`)
    }

    start() {
        this.printMatrix()
        while (true) {
            // 需找出基
            var j = Infinity
            var temp = 0
            for (var i = 1; i < this.totalCol;i++) {
                if (this.matrix[0][i] > temp && this.matrix[0][i] > 0) {
                    temp = this.matrix[0][i]
                    j = i
                }
                // if (this.matrix[0][i] > 0) {
                //     // console.log(this.matrix[0][i])
                //     console.log(`出基：第${i + 1}列 = ${matrix[0][i]}`)
                //     j = i; break one;
                // }
            }

            if (j == Infinity) {
                // 没有>0的系数了，则找到最优解
                console.log(`there reach the best`)
                break;
            } else {
                console.log(`出基：第 ${ j + 1 } 列 = ${this.matrix[0][j]}`)
            }

            // 寻找行，确定主元
            var maxTheta = Infinity
            var k = Infinity
            for (var i = 1; i < this.totalRow; i++) {
                var theta = this.matrix[i][0] / this.matrix[i][j]
                if (theta > 0 && theta < maxTheta) {
                    console.log(`进基行：第${i}行, theta = ${this.matrix[i][0]} / ${this.matrix[i][j]} = ${theta}`)
                    maxTheta = theta; k = i;
                }
            }
            
            // 无法确定主元则改题无解
            if (maxTheta == Infinity || k == Infinity) {
                console.log(`there is no resolve`)
                break;
            }

            // 初等行变化（高斯消元法）
            // 1. 把目标列归一
            var target = this.matrix[k][j]
            for (var i = 0; i < this.totalCol; i++ ) {
                this.matrix[k][i] /= target
            }
            // this.printMatrix()
            // 2. 把目标列的行（除了目标行）归零
            // console.log(`target: ${target}`)
            two: for (var i = 0; i < this.totalRow; i++ ) {
                if (i == k) continue two;// 目标行不用计算
                var target = this.matrix[i][j]
                for (var l = 0; l < this.totalCol; l++) {
                    // 根据高斯消元，计算每一行
                    // console.log(`-1 * ${this.matrix[k][l]} * ${this.matrix[k][j]}`)
                    this.matrix[i][l] += (-1 * this.matrix[k][l] * target)
                }
            }
            this.printMatrix()
            // break
        }

    }

    printMatrix() {
        console.log("------------start------------")
        this.matrix.forEach((ns,i, a) => {
            console.log(ns.join(", ") + "\n")
        })
        console.log("------------end------------")
    }
}

let matrix = [
    [0,7,12,0,0,0],
    [360,9,4,1,0,0],
    [200,4,5,0,1,0],
    [300,3,10,0,0,1],
]
// let matrix = [
//     [0,1,14,6,0,0,0,0],
//     [4,1,1,1,1,0,0,0],
//     [2,1,0,0,0,1,0,0],
//     [3,0,0,1,0,0,1,0],
//     [6,0,3,1,0,0,0,1],
// ]
// let matrix = [
//     [0,0,0,1,0,0,0,0,0,0],
//     [0,1,0,0,0,0,1,-1,0,0],
//     [0,-1,1,1,0,0,0,0,0,0],
//     [100,1,0,1,1,0,0,0,0],
//     [50,0,0,0,1,0,0,0,1,-1],
// ]
new Simplex(matrix)