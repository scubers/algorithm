class EditDistance<T> {
  constructor(private src: T[], private dest: T[]) {}

  calculate(): number {
    console.log(this.src);
    console.log(this.dest);
    let x = this.src.length;
    let y = this.dest.length;

    if (x == 0 && y == 0) return 1;
    if (x == 0 || y == 0) return 0;

    // b: x
    var step = new Map<number, number>();
    step.set(0, -1);

    /**
     * 外循环，总共有有n + m次循环，意思为把 src 删除，然后添加 dest，最多为 n + m 步
     */
    out: for (var i = 0; i < x + y; i++) {
      console.log(`========= new loop ========= i = ${i}`);
      /**
       * 令 y = x + b
       */
      for (var b = i; b >= -i; b -= 2) {
        // 超范围的相位差不进行计算
        if (b > this.dest.length || b < this.src.length * -1) continue;

        var fromB: number;
        if (i == 0) {
          fromB = 0;
        } else if (b == i) {
          // 边缘
          fromB = b - 1;
        } else if (b == -i) {
          // 边缘
          fromB = b + 1;
        } else {
          let x1 = step.get(b - 1)!;
          let x2 = step.get(b + 1)!;
          if (x1 == x2) {
            fromB = b - 1;
          } else {
            let d1 = x1 * x1 + (x1 + b) * (x1 + b);
            let d2 = x2 * x2 + (x2 + b) * (x2 + b);
            fromB = d1 > d2 ? b - 1 : b - 2;
          }
        }

        var currentX = step.get(fromB)!;
        var currentY = currentX + fromB;
        console.log(`${currentX} ${currentY}`);

        let addX = () => {
          currentX = Math.min(currentX + 1, this.src.length);
        };

        let addY = () => {
          currentY = Math.min(currentY + 1, this.dest.length);
        };

        if (fromB == b) {
          addX();
          addY();
        } else if (fromB + 1 == b) {
          addY();
        } else if (fromB - 1 == b) {
          addX();
        }

        while (
          currentX < this.src.length &&
          currentY < this.dest.length &&
          this.src[currentX + 1] != undefined &&
          this.dest[currentY + 1] != undefined &&
          this.src[currentX + 1] == this.dest[currentY + 1]
        ) {
          //   count++;
          //   if (count > 3) break;
          currentX = Math.min(currentX + 1, this.src.length);
          currentY = Math.min(currentY + 1, this.dest.length);
          //   console.log(`${currentX} ${currentY}`);
        }
        step.set(b, currentX);
        console.log(
          `fromb = ${fromB} current b = ${b} x = ${currentX} y = ${currentY}`
        );
        if (
          currentX == this.src.length - 1 &&
          currentY == this.dest.length - 1
        ) {
          console.log("reach");
          break out;
        }
      }
    }

    let count = i + (this.src[0] == this.dest[0] ? 0 : 2);

    console.log(`i = ${i}, step: ${count}, total = ${x + y}`);

    return 1 - count / (x + y);
  }
}
// var src = "ABCABBA"
// var dest = "CBABAC"
var one = "ABCABBA".split("");
var two = "CBABBAC".split("");
let step = new EditDistance(one, two).calculate();
console.log(step);
