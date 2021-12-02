import sys

# Part 1

x, y = [0, 0]

lines = sys.stdin.readlines()
for line in lines:
  [command, distance] = line.split(" ")
  if (command == "forward"):
    x += int(distance)
  elif (command == "down"):
    y += int(distance)
  elif (command == "up"):
    y -= int(distance)


print("Part 1: " + str(x * y))

# Part 2

x, y, aim = [0, 0, 0]

for line in lines:
  [command, distance] = line.split(" ")
  if (command == "forward"):
    x += int(distance)
    y += aim * int(distance)
  elif (command == "down"):
    aim += int(distance)
  elif (command == "up"):
    aim -= int(distance)


print("Part 1: " + str(x * y))