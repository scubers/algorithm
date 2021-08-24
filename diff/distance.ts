import * as wuzzy from "wuzzy";

class EditDistance<T> {
  constructor(private src: T[], private dest: T[]) {}

  calculate(): number {
    console.log(this.src);
    console.log(this.dest);
    let x = this.src.length;
    let y = this.dest.length;

    if (x == 0 && y == 0) return 100;
    if (x == 0 || y == 0) return 0;

    // b: x
    var step = new Map<number, number>();
    step.set(-1, 0);

    /**
     * 外循环，总共有有n + m次循环，意思为把 src 删除，然后添加 dest，最多为 n + m 步
     */
    out: for (var i = 0; i < x + y; i++) {
      console.log(`\n========= new loop ========= i = ${i}\n`);
      /**
       * 令 y = x + b
       * 内循环，因为斜率为
       */
      for (var b = i; b >= -i; b -= 2) {
        // 超范围的相位差不进行计算
        if (b > this.dest.length || b < this.src.length * -1) continue;

        var fromB: number;
        if (b == i) {
          // 边缘
          fromB = b - 1;
        } else if (b == -i) {
          // 边缘
          fromB = b + 1;
        } else {
          let b1 = b - 1;
          let b2 = b + 1;

          let x1 = step.get(b1)!;
          let x2 = step.get(b2)!;

          // if (x1 == x2) {
          //   fromB = b1;
          // } else {
          //   let d1 = x1 * x1 + (x1 + b1) * (x1 + b1);
          //   let d2 = x2 * x2 + (x2 + b2) * (x2 + b2);
          //   fromB = d2 > d1 ? b2 : b1;
          // }

          if (x1 != x2) {
            fromB = x2 > x1 ? b2 : b1;
          } else {
            fromB = b2;
            // let d1 = x1 * x1 + (x1 + b1) * (x1 + b1);
            // let d2 = x2 * x2 + (x2 + b2) * (x2 + b2);
            // fromB = d2 > d1 ? b2 : b1;
          }
        }

        var currentX = step.get(fromB)!;
        var currentY = currentX + fromB;

        let addX = () => {
          currentX = Math.min(currentX + 1, this.src.length);
        };

        let addY = () => {
          currentY = Math.min(currentY + 1, this.dest.length);
        };

        if (fromB + 1 == b) {
          addY();
        } else if (fromB - 1 == b) {
          addX();
        }

        while (
          currentX < this.src.length &&
          currentY < this.dest.length &&
          this.src[currentX] == this.dest[currentY]
        ) {
          // addX();
          // addY();
          currentX++;
          currentY++;
        }

        step.set(b, currentX);

        console.log(
          `fromb = ${fromB} current b = ${b} x = ${currentX} y = ${currentY}`
        );
        if (currentX == this.src.length && currentY == this.dest.length) {
          console.log("reach");
          break out;
        }
        // printPath(this.src, this.dest, step);
      }
    }

    console.log(`i = ${i}, total = ${x + y}`);

    // return Math.round((1 - i / (x + y)) * 100);
    // let rate = (x + y - i) / (x + y);
    let rate = 1 - i / (x + y);
    return Math.round(rate * 100);
  }
}
// var src = "ABCABBA"
// var dest = "CBABAC"
var one = "abcabba".split("");
var two = "cbabac".split("");

// var one = "oad".split("");
// var two = "ae".split("");

// var one = "oad".split("");
// var two = "ade".split("");
// let step = new EditDistance(one, two).calculate();
// console.log(step);

class TestSet {
  constructor(public src: string, public dest: string, public result: number) {}
}

let testSet: TestSet[] = [
  new TestSet("abca", "cbab", 50),
  new TestSet("abcabba", "cbabac", 62),
  new TestSet("oad", "ae", 40),
  new TestSet("abc", "abc", 100),
  new TestSet("abc", "", 0),
  new TestSet("", "", 100),
  new TestSet("oad", "ade", 67),
  new TestSet("i am a good person", "i am one good person", 89),
  new TestSet("a", "abcdefg", 25),
  new TestSet("x", "abcdefg", 0),
  new TestSet("d", "abcdefg", 25),
  new TestSet("g", "abcdefg", 25),
  new TestSet("Email address", "Email address *", 93),
  new TestSet("Name", "Name *", 80),
  new TestSet("mtacun", "mitcmu", 67),
];
// abcabba
// cbabac
testSet.forEach((v, i) => {
  let result1 = new EditDistance(v.src.split(""), v.dest.split("")).calculate();
  if (result1 != v.result) {
    throw `${i}: [${v.src}  ${v.dest}] = ${result1}, needs ${v.result}`;
  }
  let result2 = new EditDistance(v.dest.split(""), v.src.split("")).calculate();
  if (result2 != v.result) {
    throw `${i} reverse: [${v.dest}  ${v.src}] = ${result2}, needs ${v.result}`;
  }

  let result = wuzzy.levenshtein(v.src, v.dest);

  console.log(
    `[${v.src} ${v.dest}] = wuzzy: ${Math.round(result * 100)}, distance: ${
      v.result
    }`
  );
});

function printPath<T>(src: T[], dest: T[], map: Map<number, number>) {
  console.log(`  ${src.map((e) => ` ${e} `).join("")}`);
  dest.forEach((d, i) => {
    var text = ` ${d} `;
    src.forEach((s, i) => {
      text += `  |`;
    });
    console.log(text);
    console.log(`  ${src.map((e) => " _ ").join("")}`);
  });
}
