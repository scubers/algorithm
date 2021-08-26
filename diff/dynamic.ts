import { deprecate } from "util";

function calculate(src: string, dest: string): number {
  let listA = src.split("");
  let listB = dest.split("");

  if (listA.length == 0 || listB.length == 0) return 0;

  var dp: number[][] = [];

  for (var y = 0; y <= dest.length; y++) {
    if (dp.length <= y) dp.push([]);

    for (var x = 0; x <= src.length; x++) {
      if (dp[y].length <= x) dp[y].push(0);

      if (y == 0 || x == 0) {
        dp[y][x] = 0;
      } else {
        if (listA[x - 1] === listB[y - 1]) {
          dp[y][x] = dp[y - 1][x - 1] + 1;
        } else {
          dp[y][x] = Math.max(dp[y - 1][x], dp[y][x - 1]);
        }
      }
    }
  }

  var list: string[] = [];

  var x = listA.length;
  var y = listB.length;
  while (true) {
    if (dp[y][x] == 0) break;
    if (listA[x - 1] == listB[y - 1]) {
      list.push(listA[x - 1]);
      x -= 1;
      y -= 1;
    } else {
      let top = dp[y - 1][x];
      let left = dp[y][x - 1];
      if (top >= left) {
        y -= 1;
      } else {
        x -= 1;
      }
    }
  }

  console.log(list.reverse().join(""));

  // 反向追溯

  dp.forEach((v, i) => {
    if (i == 0) {
      console.log(`0, 0, ${listA.join(", ")}`);
    }
    console.log(`${listB[i - 1] || 0}, ${v.join(", ")}`);
  });
  return dp[listB.length][listA.length];
}

let count = calculate("ABCABBA", "CBABAC");
console.log(count);
