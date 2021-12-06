import * as fs from "fs";

// {
//     xpos: {
//         ypos: numCrossings
//     }
// }
type Grid = Record<number, Record<number, number>>;

function pointOnDiagonalLine(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  return x - Math.min(x1, x2) == y - Math.min(y1, y2);
}

function* pointsInLine(x1, y1, x2, y2): Generator<{ x: number; y: number }> {
  if (x1 == x2) {
    // vertical line
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      yield { x: x1, y };
    }
  } else if (y1 == y2) {
    // horizontal line
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      yield { x, y: y1 };
    }
  } else {
    // diagonal line
    const length = Math.abs(x2 - x1);
    for (let idx = 0; idx <= length; idx++) {
        const x = x2 > x1 ? x1 + idx : x1 - idx
        const y = y2 > y1 ? y1 + idx : y1 - idx
        yield { x, y };
    }
  }
}

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");
const lines = stdin.split("\n");

const hv_grid: Grid = {};
const full_grid: Grid = {};
let hv_intersections = 0;
let full_intersections = 0;
for (const line of lines) {
  if (!line) break;
//   console.log("READING LINE", line);
  const [p1, p2] = line.split("->");
  const [x1, y1] = p1.split(",").map((c) => parseInt(c.trim()));
  const [x2, y2] = p2.split(",").map((c) => parseInt(c.trim()));
  for (const { x, y } of pointsInLine(x1, y1, x2, y2)) {
    // console.log(x, y);
    if (x1 == x2 || y1 == y2) {
      hv_grid[x] ??= {};
      hv_grid[x][y] ??= 0;
      hv_grid[x][y]++;
      if (hv_grid[x][y] == 2) {
        hv_intersections++;
      }
      full_grid[x] ??= {};
      full_grid[x][y] ??= 0;
      full_grid[x][y]++;
      if (full_grid[x][y] == 2) {
        full_intersections++;
      }
    } else {
      full_grid[x] ??= {};
      full_grid[x][y] ??= 0;
      full_grid[x][y]++;
      if (full_grid[x][y] == 2) {
        full_intersections++;
      }
    }
  }
//   for (let x = 0; x < 10; x++) {
//     let line = "";
//     for (let y = 0; y < 10; y++) {
//       if (y in full_grid && x in full_grid[y]) {
//         line += full_grid[y][x];
//       } else {
//         line += ".";
//       }
//     }
//     console.log(line);
//   }
}

console.log("Part 1:", hv_intersections);
console.log("Part 2:", full_intersections);
