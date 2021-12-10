import { sign } from "crypto";
import * as fs from "fs";

enum Segment {
    TOP = "TOP",
    MIDDLE = "MIDDLE",
    BOTTOM = "BOTTOM",
    TOPLEFT = "TOPLEFT",
    TOPRIGHT = "TOPRIGHT",
    BOTTOMLEFT = "BOTTOMLEFT",
    BOTTOMRIGHT = "BOTTOMRIGHT",
}

const numberMap: Record<number, Segment[]> = {
    0: [
        Segment.TOP,
        Segment.TOPLEFT,
        Segment.BOTTOMLEFT,
        Segment.BOTTOM,
        Segment.BOTTOMRIGHT,
        Segment.TOPRIGHT,
    ],
    1: [Segment.BOTTOMRIGHT, Segment.TOPRIGHT],
    2: [
        Segment.TOP,
        Segment.MIDDLE,
        Segment.BOTTOMLEFT,
        Segment.BOTTOM,
        Segment.TOPRIGHT,
    ],
    3: [
        Segment.TOP,
        Segment.MIDDLE,
        Segment.BOTTOMRIGHT,
        Segment.BOTTOM,
        Segment.TOPRIGHT,
    ],
    4: [Segment.MIDDLE, Segment.BOTTOMRIGHT, Segment.TOPRIGHT, Segment.TOPLEFT],
    5: [
        Segment.TOP,
        Segment.TOPLEFT,
        Segment.BOTTOMRIGHT,
        Segment.MIDDLE,
        Segment.BOTTOM,
    ],
    6: [
        Segment.TOP,
        Segment.TOPLEFT,
        Segment.BOTTOMRIGHT,
        Segment.MIDDLE,
        Segment.BOTTOM,
        Segment.BOTTOMLEFT,
    ],
    7: [Segment.TOP, Segment.BOTTOMRIGHT, Segment.TOPRIGHT],
    8: [
        Segment.TOPLEFT,
        Segment.TOPRIGHT,
        Segment.MIDDLE,
        Segment.BOTTOMLEFT,
        Segment.BOTTOMRIGHT,
        Segment.TOP,
        Segment.BOTTOM,
    ],
    9: [
        Segment.TOP,
        Segment.TOPLEFT,
        Segment.MIDDLE,
        Segment.BOTTOM,
        Segment.BOTTOMRIGHT,
        Segment.TOPRIGHT,
    ],
};

const reverseNumberMap: Record<Segment, number[]> = Object.entries(
    numberMap
).reduce((map, [num, segments]) => {
    segments.forEach((segment) => {
        map[segment] ??= [];
        map[segment].push(+num);
    });
    return map;
}, {} as Record<Segment, number[]>);

const segmentCountMap: Record<number, number> = Object.fromEntries(
    Object.entries(numberMap).map(([num, segments]) => [num, segments.length])
);

const reverseSegmentCountMap: Record<number, number[]> = Object.entries(
    segmentCountMap
).reduce((map, [num, segmentCount]) => {
    map[segmentCount] ??= [];
    map[segmentCount].push(+num);
    return map;
}, {} as Record<number, number[]>);

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");
const patterns = stdin
    .split("\n")
    .filter(Boolean)
    .map((x) => {
        const [signals, outputs] = x.split("|").map((y) => y.trim());
        return {
            signals: signals.split(" ").filter((code) => !!code),
            outputs: outputs.split(" ").filter((code) => !!code),
        };
    });

let outputWithUniqueSignals = 0;
let sumOfOutputs = 0;

for (const { signals, outputs } of patterns) {
    const segmentGuesses: any = Object.fromEntries(
        Object.values(Segment).map((segment) => [
            segment,
            ["a", "b", "c", "d", "e", "f", "g"],
        ])
    );
    for (const output of outputs) {
        narrowGuesses(output, segmentGuesses, true);
    }
    for (const signal of signals) {
        narrowGuesses(signal, segmentGuesses, false);
    }
    const possibleNextGuesses = getPossibleGuesses(segmentGuesses);
    let result;
    for (const segmentGuess of possibleNextGuesses) {
        for (const codeGuess of segmentGuess[1]) {
            result = searchForSolution(
                segmentGuesses,
                [segmentGuess[0] as any, codeGuess],
                [...outputs, ...signals]
            );
            if (result) {
                break;
            }
        }
        if (result) {
            break;
        }
    }
    if (result) {
        const lookup = Object.fromEntries(
            Object.entries<any>(result).map(([segment, [code]]) => [
                code,
                segment,
            ])
        );
        sumOfOutputs +=
            parseInt(
                outputs
                    .map((x) => getNumberFromSignalAndLookup(x, lookup))
                    .join("")
            );
    } else {
        console.log("NO RESULT FOUND");
    }
}

function narrowGuesses(signal: string, guesses, incrementCount = false) {
    const uniqueSignals = new Set(Array.from(signal));
    const numbersItIs = reverseSegmentCountMap[uniqueSignals.size];
    const numbersItsNot = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
        (x) => !numbersItIs.includes(x)
    );
    const possibleSegments = new Set(
        numbersItIs.flatMap((number) =>
            numberMap[number].filter((x) => typeof x === "string")
        )
    );

    if (numbersItIs.length === 1) {
        if (incrementCount) {
            outputWithUniqueSignals += 1;
        }
        for (const segment of possibleSegments) {
            guesses[segment] = guesses[segment].filter((x) =>
                uniqueSignals.has(x)
            );
        }
    }
    const segmentsToNarrow = new Set(
        numbersItsNot
            .flatMap((number) =>
                numberMap[number].filter((x) => typeof x === "string")
            )
            .filter((x) => !possibleSegments.has(x))
    );

    segmentsToNarrow.forEach((segment) => {
        guesses[segment] = guesses[segment].filter(
            (x) => !uniqueSignals.has(x)
        );
    });
}

function searchForSolution(
    possibilities: Record<Segment, string[]>,
    currentGuess: [Segment, string],
    signals: string[]
) {
    const nextPossiblities = clone(possibilities);
    nextPossiblities[currentGuess[0]] = [currentGuess[1]];

    Object.entries(nextPossiblities).forEach(
        ([segment, possibleCharacters]) => {
            if ((segment as any) !== currentGuess[0])
                nextPossiblities[segment] = possibleCharacters.filter(
                    (x) => currentGuess[1] !== x
                );
        }
    );

    const unanswered = Object.values(nextPossiblities).filter(
        (x) => x.length > 1
    );
    if (Object.values(nextPossiblities).some((x) => x.length === 0)) {
        return null;
    } else if (unanswered.length === 0) {
        if (validateAnswer(nextPossiblities, signals)) {
            return nextPossiblities; // All Segment's are assigned 1 value
        } else {
        }
    }
    const possibleNextGuesses = getPossibleGuesses(nextPossiblities);
    for (const segmentGuess of possibleNextGuesses) {
        for (const codeGuess of segmentGuess[1]) {
            const result = searchForSolution(
                nextPossiblities,
                [segmentGuess[0] as any, codeGuess],
                signals
            );
            if (result) {
                return result;
            }
        }
    }
}

function validateAnswer(answer: Record<Segment, string[]>, signals: string[]) {
    const lookup = Object.fromEntries(
        Object.entries<any>(answer).map(([segment, [code]]) => [code, segment])
    );
    for (const signal of signals) {
        const number = getNumberFromSignalAndLookup(signal, lookup);
        if (number === undefined) {
            return false;
        }
    }
    return true;
}

function getNumberFromSignalAndLookup(signal: string, lookup: any): number {
    const signalSegments = Array.from(signal).map((x) => lookup[x]);
    for (let i = 0; i < 10; i++) {
        if (eqSet(numberMap[i], signalSegments)) {
            return +i;
        }
    }
}

function eqSet(as: string[], bs: string[]) {
    if (as.length !== bs.length) return false;
    for (const a of as) if (!bs.includes(a)) return false;
    return true;
}

function getPossibleGuesses(possibilities: Record<Segment, string[]>) {
    return Object.entries(possibilities).filter(
        ([segment, possibilities]) => possibilities.length > 1
    );
}

console.log("Part 1:", outputWithUniqueSignals);
console.log("Part 2:", sumOfOutputs);

function clone<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
}
