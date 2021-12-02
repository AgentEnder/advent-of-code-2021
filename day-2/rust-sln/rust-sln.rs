use std::io::{prelude::*, stdin};

fn main() {
    let stdin = stdin();
    let lines = stdin
        .lock()
        .lines()
        .map(|x| x.unwrap())
        .collect::<Vec<String>>();

    let mut x = 0;
    let mut y = 0;
    let mut iter = lines.iter();
    for line in iter {
        let mut split = line.split_whitespace();
        let command = split.next().unwrap();
        let distance = split.next().unwrap().parse::<i32>().unwrap();
        if command == "forward" {
            x += distance;
        } else if command == "down" {
            y += distance;
        } else if command == "up" {
            y -= distance;
        }
    }

    std::println!("Part 1: {}", x * y);

    x = 0;
    y = 0;
    let mut aim = 0;

    iter = lines.iter();
    for line in iter {
        let mut split = line.split_whitespace();
        let command = split.next().unwrap();
        let distance = split.next().unwrap().parse::<i32>().unwrap();
        if command == "forward" {
            x += distance;
            y += aim * distance
        } else if command == "down" {
            aim += distance;
        } else if command == "up" {
            aim -= distance;
        }
    }
    std::println!("Part 2: {}", x * y);
}
