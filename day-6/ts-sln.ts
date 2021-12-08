import * as fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");
const fishByAge = stdin
    .split("\n")[0]
    .split(",")
    .reduce((ageMap, fish) => {
        if (!!fish) {
            let fishAge = parseInt(fish);
            const current = ageMap.get(fishAge);
            ageMap.set(fishAge, current ? current + 1 : 1);
        }
        return ageMap;
    }, new Map());

function fishAfterDays(ageMap: Map<number, number>, days: number) {
    let current = ageMap;
    let next: Map<number, number> = new Map();
    for (let day = 0; day < days; day++) {
        for (const [age, quantity] of current.entries()) {
            if (+age === 0) {
                next.set(6, next.get(6) ? next.get(6) + quantity : quantity);
                next.set(8, quantity);
            } else {
                const nextAge = age - 1;
                next.set(
                    nextAge,
                    next.get(nextAge) ? next.get(nextAge) + quantity : quantity
                );
            }
        }
        current = next;
        next = new Map();
    }
    return Array.from(current.values()).reduce(
        (sum: number, quantity) => sum + quantity,
        0
    );
}

console.log("Part 1:", fishAfterDays(fishByAge, 80));
console.log("Part 2:", fishAfterDays(fishByAge, 256));
