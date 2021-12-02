
fun countIncreases(list: List<Int>): Int {
   var result = 0;
   for ((idx, num) in list.withIndex()) {
       if (idx > 0 && num > list[idx - 1]) {
           result += 1;
       }
   }
   return result;
}

fun main() {
    val lines = generateSequence(::readLine).map{ it.toInt() }.toList()
    println("Part 1: ${countIncreases(lines)}")
    val size = lines.size
    var windows = lines.mapIndexedNotNull {idx, v -> if (idx >= size - 2) null else v + lines[idx+1] + lines[idx+2]};
    println("Part 2: ${countIncreases(windows)}")
}