const charsum = function(s) {
  var i,
    sum = 0
  for (i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i)
  }
  return sum
}
export const hashArrayOfStrings = function(a) {
  var i,
    sum = 0,
    product = 1
  for (i = 0; i < a.length; i++) {
    var cs = charsum(a[i])
    if (product % cs > 0) {
      product = product * cs
      sum = sum + 65027 / cs
    }
  }
  return ('' + sum).slice(0, 16)
}
export default hashArrayOfStrings
