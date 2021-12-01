import * as fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");

function countIncreases(list: number[]) {
    return list.reduce((increases, next, idx) => {
        if (idx > 0 && next > list[idx - 1]) {
            return increases + 1;
        }
        return increases;
    }, 0);
}

const lines: number[] = stdin.split("\n").map((x) => parseInt(x));
const p1_result = countIncreases(lines);

const sliding_windows = lines.slice(0, -2).reduce((windows, next, idx) => {
    windows.push(next + lines[idx + 1] + lines[idx + 2]);
    return windows;
}, []);

const p2_result = countIncreases(sliding_windows);

console.log("Part 1: " + p1_result);
console.log("Part 2: " + p2_result);
