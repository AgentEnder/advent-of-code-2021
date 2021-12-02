import { execSync, ExecSyncOptionsWithBufferEncoding } from "child_process";
import { red, yellow } from "colors";
import { sync as globSync } from "fast-glob";
import { readFileSync, writeFileSync } from "fs";
import { extname, join, dirname, parse, resolve } from "path";
import { performance } from "perf_hooks";
import Ignore from "ignore";

const problemDirectories = globSync("day-*", { onlyDirectories: true });

const executeCommand: Record<
    string,
    (file) => string | { build: string; run: string }
> = {
    ".py": (file) => `python3 ${file}`,
    ".csproj": (file) => {
        const outDir = join(dirname(file), "build");
        const dllPath = join(outDir, parse(file).name) + ".dll";
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
    }
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
        const cwd = join(directory, dirname(file));
        if (!(extension in executeCommand)) {
            continue;
        }
        const relativePath = join(directory, file);
        console.log("Running ", relativePath);
        const command = executeCommand[extension](resolve(relativePath));
        if (typeof command === "string") {
            const start = performance.now();
            const stdout = execSync(command, {
                cwd,
                input,
            }).toString();
            const end = performance.now();
            lines.push(`${file}\t\t${formatTime(end - start)}`);
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
            lines.push(`${file}\t\t${formatTime(end - start)}`);
            lines.push(
                `Build ${formatTime(buildEnd - start)}, Run: ${formatTime(
                    end - buildEnd
                )}`
            );
            lines.push("");
            lines.push(stdout);
        }
    }

    writeFileSync(join(directory, "output.txt"), lines.join("\n"));
});

function execSyncButLogErrors(cmd, options: ExecSyncOptionsWithBufferEncoding) {
    try {
        return execSync(cmd, options);
    } catch (e) {
        console.log("\n", red("ERROR:"), e.message);
        console.log("\n\t", yellow("stdout"), e.stdout.toString());
        console.log("\n\t", yellow("stderr"), e.stderr.toString());
        process.exit(1);
    }
}

function formatTime(ms: number) {
    return ms.toFixed(3);
}
