import * as fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");
const crabPositions = stdin
    .split("\n")[0]
    .split(",")
    .map((x) => {
        return parseInt(x);
    });

const min = Math.min(...crabPositions);
const max = Math.max(...crabPositions);

const p1FuelCosts: Record<number, number> = {};
const p2FuelCosts: Record<number, number> = {};

for (let position = min; position < max; position++) {
    let p1Cost = 0;
    let p2Cost = 0;
    crabPositions.forEach((pos) => {
        const distance = Math.abs(pos - position);
        p1Cost += distance;
        p2Cost += (distance * (distance + 1)) / 2;
    });
    p1FuelCosts[position] = p1Cost;
    p2FuelCosts[position] = p2Cost;
}

console.log(
    "Part 1:",
    Object.entries(p1FuelCosts).sort(
        ([posA, costA], [posB, costB]) => costA - costB
    )[0][1]
);

console.log(
    "Part 2:",
    Object.entries(p2FuelCosts).sort(
        ([posA, costA], [posB, costB]) => costA - costB
    )[0][1]
);
// console.log("Part 2:", fishAfterDays(fishByAge, 256));
