import * as fs from "fs";

// Part 1

let [x, y] = [0, 0];

const stdin = fs.readFileSync(process.stdin.fd, "utf-8").split("\n");
for (const line of stdin) {
    const [command, distance] = line.split(" ");
    if (command == "forward") x += parseInt(distance);
    else if (command == "down") y += parseInt(distance);
    else if (command == "up") y -= parseInt(distance);
}

console.log("Part 1: " + x * y);

// Part 2

let aim = 0;
[x, y] = [0, 0];
for (const line of stdin) {
    const [command, distance] = line.split(" ");
    if (command == "forward") {
        x += parseInt(distance);
        y += aim * parseInt(distance);
    } else if (command == "down") aim += parseInt(distance);
    else if (command == "up") aim -= parseInt(distance);
}

console.log("Part 2: " + x * y);
