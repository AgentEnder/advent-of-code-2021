import * as fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd, "utf-8").trim();
const grid = stdin
    .split("\n")
    .map((x) => Array.from(x.trim()).map((y) => parseInt(y)));

interface Position {
    x: number;
    y: number;
    z: number;
}

const lowSpots: Position[] = [];

const neighborCache = {};
function getNeighborsForPoint(x: number, y: number): Position[] {
    const cacheKey = `${x},${y}`;
    if (cacheKey in neighborCache) {
        return neighborCache[cacheKey];
    }

    const neighbors = [];
    if (x > 0) {
        neighbors.push({ x: x - 1, y, z: grid[y][x - 1] });
    }
    if (x < grid[y].length - 1) {
        neighbors.push({ x: x + 1, y, z: grid[y][x + 1] });
    }
    if (y > 0) {
        neighbors.push({ x, y: y - 1, z: grid[y - 1][x] });
    }
    if (y < grid.length - 1) {
        neighbors.push({ x, y: y + 1, z: grid[y + 1][x] });
    }
    return (neighborCache[cacheKey] = neighbors);
}

grid.forEach((row, y) => {
    row.forEach((z, x) => {
        const neighbors = getNeighborsForPoint(x, y);
        const lowSpot = neighbors.every((neighbor) => neighbor.z > z);
        if (lowSpot) {
            lowSpots.push({ x, y, z });
        }
    });
});

console.log(
    "Part 1:",
    lowSpots.reduce(
        (cumulativeRiskScore, { z }) => cumulativeRiskScore + 1 + z,
        0
    )
);

const basins = lowSpots.map((x) => floodFill(x) + 1).sort((a, b) => a - b);
console.log(
    "Part 2:",
    basins
        .slice(-3)
        .reduce((product, multiplicand) => product * multiplicand, 1)
);

function floodFill(spot: Position, seen: Set<string> = new Set()): number {
    const buildSetKey = (position) => [position.x, position.y].join(",");
    const neighbors = getNeighborsForPoint(spot.x, spot.y);
    const nextSpots = neighbors.filter(
        // Filter out boundaries as well as already counted spots
        (neighbor) => neighbor.z !== 9 && !seen.has(buildSetKey(neighbor))
    );

    // Ensure recursion doesn't include spots already counted
    seen.add(buildSetKey(spot));
    nextSpots.forEach((s) => seen.add(buildSetKey(s)));

    return (
        nextSpots.length +
        nextSpots.reduce((newSpots, s) => newSpots + floodFill(s, seen), 0)
    );
}
