import { execSync, ExecSyncOptionsWithBufferEncoding } from "child_process";
import { red, yellow } from "colors";
import { sync as globSync } from "fast-glob";
import { readFileSync, writeFileSync } from "fs";
import { extname, join, dirname, parse, resolve } from "path";
import { performance } from "perf_hooks";
import Ignore from "ignore";
import yargsParser from "yargs-parser";

const argv = yargsParser(process.argv.slice(2));
let problemDirectories = globSync("day-*", { onlyDirectories: true });

const debug = argv.debug || process.env.DEBUG == "true";

if (argv.day) {
    problemDirectories = [
        problemDirectories.find((x) => x === `day-${argv.day}`),
    ];
}

const executeCommand: Record<
    string,
    (file) => string | { build: string; run: string }
> = {
    ".py": (file) => `python3 ${file}`,
    ".csproj": (file) => {
        const { dir, name } = parse(file);
        const outDir = join("build", dir, name);
        const dllPath = join(outDir, name) + ".dll";
        return {
            build: `dotnet build ${file} -c Release -o ${outDir}`,
            run: `dotnet ${dllPath}`,
        };
    },
    ".rs": (file) => {
        const name = parse(file).name;
        return {
            build: `rustc ${file} --out-dir build/${name}`,
            run: `./build/${name}/${name}`,
        };
    },
    ".ts": (file) => {
        const name = parse(file).name;
        return {
            build: `npx tsc ${file} --outDir build`,
            run: `node ./build/${name}.js`,
        };
    },
    ".kt": (file) => {
        const name = parse(file).name;
        return {
            build: `kotlinc ${file} -include-runtime -d ./build/${name}.jar`,
            run: `java -jar ./build/${name}.jar`,
        };
    },
};

const ignore = Ignore();
ignore.add(readFileSync(".gitignore").toString());

problemDirectories.forEach((directory) => {
    console.log("Evaluating solutions for", directory);
    const solutionFiles = globSync(
        `**/*@(${Object.keys(executeCommand).join("|")})`,
        { cwd: directory }
    ).filter(ignore.createFilter());
    const lines: string[] = [];
    const input = readFileSync(join(directory, "input.txt"));

    for (const file of solutionFiles) {
        const extension = extname(file);
        const cwd = directory;
        if (!(extension in executeCommand)) {
            continue;
        }
        process.stdout.write("Running " + file + "\x1B[0G");
        const command = executeCommand[extension](file);
        try {
            let timeString: string;
            if (typeof command === "string") {
                const start = performance.now();
                const stdout = execSync(command, {
                    cwd,
                    input,
                }).toString();
                const end = performance.now();
                timeString = formatTime(end - start);
                lines.push(`${file}\t\t${timeString}`);
                lines.push("");
                lines.push(stdout);
            } else {
                const start = performance.now();
                execSyncButLogErrors(command.build, {
                    cwd,
                }).toString();
                const buildEnd = performance.now();
                const stdout = execSync(command.run, {
                    cwd,
                    input,
                }).toString();
                const end = performance.now();
                const runTime = formatTime(end - buildEnd);
                const buildTime = formatTime(buildEnd - start);
                timeString = `${runTime} (build: ${buildTime})`;
                lines.push(`${file}\t\t${formatTime(end - start)}`);
                lines.push(`Build ${buildTime}, Run: ${runTime}`);
                lines.push("");
                lines.push(stdout);
            }
            console.log(
                "Running " +
                    file +
                    new Array(50 - file.length - 8).join(" ") +
                    `✔ ${timeString}`
            );
        } catch (e) {
            console.log(
                "Running " +
                    file +
                    new Array(50 - file.length - 8).join(" ") +
                    "X"
            );
        }
    }
    writeFileSync(join(directory, "output.txt"), lines.join("\n"));
    console.log("");
});

function execSyncButLogErrors(cmd, options: ExecSyncOptionsWithBufferEncoding) {
    try {
        return execSync(cmd, options);
    } catch (e) {
        if (debug) {
            console.log("\n", red("ERROR:"), e.message);
            console.log("\n\t", yellow("stdout"), e.stdout.toString());
            console.log("\n\t", yellow("stderr"), e.stderr.toString());
            process.exit(1);
        }
        throw e;
    }
}

function formatTime(ms: number) {
    return ms.toFixed(3) + "ms";
}
