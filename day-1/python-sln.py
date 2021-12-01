import sys

p1_result = 0
p2_result = 0

def countIncreases(enum):
  result = 0
  for idx, line in enumerate(enum):
    if (idx > 0 and int(line) > int(enum[idx-1])):
      result +=1
  return result

lines = sys.stdin.readlines()
p1_result = countIncreases(lines)
sliding_windows = [int(lines[x]) + int(lines[x + 1]) + int(lines[x + 2]) for x in range(len(lines) - 2)]
p2_result = countIncreases(sliding_windows)

print("Part 1: " + str(p1_result))
print("Part 2: " + str(p2_result))