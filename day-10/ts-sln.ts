import * as fs from "fs";

const stdin = fs.readFileSync(process.stdin.fd, "utf-8").trim();
const lines = stdin.split("\n").map((x) => x.trim());

const invalidScoreMap = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
};

const missingScoreMap = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
};

const openingTagMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
};

const openingTags = new Set(Object.keys(openingTagMap));

let stack = [];
let p1score = 0;
let p2scores = [];

for (const line of lines) {
    const tokens = Array.from(line);
    let invalid = false;
    let p2LineScore = 0;
    for (const token of tokens) {
        if (!openingTags.has(token)) {
            const expected = openingTagMap[stack[stack.length - 1]];
            if (token === expected) {
                stack.pop();
            } else {
                p1score += invalidScoreMap[token];
                invalid = true;
                break;
            }
        } else {
            stack.push(token);
        }
    }
    if (!invalid) {
        while (stack.length > 0) {
            const openingTag = stack.pop();
            const neededClosingTag = openingTagMap[openingTag];
            p2LineScore = p2LineScore * 5 + missingScoreMap[neededClosingTag];
        }
        p2scores.push(p2LineScore);
    }
    stack = [];
}

console.log("Part 1:", p1score);
console.log(
    "Part 2:",
    p2scores[Math.floor(p2scores.sort((a, b) => a - b).length / 2)]
);
