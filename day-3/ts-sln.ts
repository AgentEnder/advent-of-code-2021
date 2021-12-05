import * as fs from "fs";

type Bit = "0" | "1";
type BinaryString = Bit[];
type BinaryList = BinaryString[];

function invertBinaryString(binary: string): string {
    return Array.from(binary)
        .map((x: string): Bit => (x === "0" ? "1" : "0"))
        .join("");
}

const getMostOrLeastCommonString =
    (
        array: BinaryList,
        defaultValue: "0" | "1",
        mode: "least" | "most" = "most"
    ) =>
    (gamma, _, idx) => {
        const bitCount = {
            "0": 0,
            "1": 0,
        };
        for (let i = 0; i < array.length; i++) {
            const bit = array[i][idx];
            bitCount[bit]++;
        }
        gamma +=
            bitCount[0] === bitCount[1]
                ? defaultValue
                : mode === "most"
                ? bitCount[0] > bitCount[1]
                    ? "0"
                    : "1"
                : bitCount[0] < bitCount[1]
                ? "0"
                : "1";
        return gamma;
    };

const stdin = fs.readFileSync(process.stdin.fd, "utf-8");
const lines: BinaryList = stdin
    .split("\n")
    .map((binary) => Array.from(binary) as BinaryString);

const gammaRate = lines[0].reduce(getMostOrLeastCommonString(lines, "0"), "");

const epsilonRate = invertBinaryString(gammaRate);

const p1_result = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);

console.log("Part 1: " + p1_result);

function searchForMatchingBitValues(
    searchValue: string,
    defaultValue: Bit,
    mode: "most" | "least",
    array: BinaryList,
    idx = 0
) {
    if (array.length === 1) {
        return array[0].join("");
    }

    const binary = Array.from(searchValue) as BinaryString;
    const newList = array.filter((x) => x[idx] === binary[idx]);
    const nextSearchValue = newList[0].reduce(
        getMostOrLeastCommonString(newList, defaultValue, mode),
        ""
    );
    return searchForMatchingBitValues(
        nextSearchValue,
        defaultValue,
        mode,
        newList,
        idx + 1
    );
}
const oxygenGenerator = searchForMatchingBitValues(
    gammaRate,
    "1",
    "most",
    lines
);
const co2Scrubber = searchForMatchingBitValues(
    epsilonRate,
    "0",
    "least",
    lines
);

const p2_result = parseInt(oxygenGenerator, 2) * parseInt(co2Scrubber, 2);

console.log("Part 2: " + p2_result);
