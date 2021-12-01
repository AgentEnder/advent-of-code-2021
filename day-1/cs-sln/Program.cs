using System.Collections.Generic;

// BEGIN READ INPUT
var numbers = new List<int>();
string line;

while ((line = Console.ReadLine()) != null)
{
    numbers.Add(Int32.Parse(line));
}
// END READ INPUT


int countIncreases(IEnumerable<int> list)
{
    var result = 0;
    for (int i = 0; i < list.Count(); i++)
    {
        if (i > 0 && list.ElementAt(i) > list.ElementAt(i - 1))
        {
            result += 1;
        }
    }
    return result;
}

int p1Result = countIncreases(numbers);
var sliding_windows = numbers.SkipLast(2).Select((number, idx) => number + numbers[idx + 1] + numbers[idx + 2]);
int p2Result = countIncreases(sliding_windows);

Console.WriteLine($"Part 1: {p1Result}");
Console.WriteLine($"Part 2: {p2Result}");