use std::io::{prelude::*, stdin};

fn count_increasing(vector: Vec<i32>) -> i32 {
    let mut result = 0;
    for (idx, item) in vector.iter().enumerate() {
        if idx > 0 && *item > vector[idx - 1] {
            result += 1;
        }
    }
    return result;
}

fn main() {
    let stdin = stdin();
    let lines = stdin
        .lock()
        .lines()
        .map(|x| x.unwrap().parse::<i32>().unwrap())
        .collect::<Vec<i32>>();
    let mut sliding_windows: Vec<i32> = vec![];
    let iter = lines.iter();
    for (i, num) in iter.enumerate() {
        if i > 0 {
            sliding_windows[i - 1] = sliding_windows[i - 1] + num
        }
        if i > 1 {
            sliding_windows[i - 2] = sliding_windows[i - 2] + num
        }
        sliding_windows.push(*num);
    }
    sliding_windows.pop();
    sliding_windows.pop();

    std::println!("Part 1: {}", count_increasing(lines));
    std::println!("Part 2: {}", count_increasing(sliding_windows));
}
