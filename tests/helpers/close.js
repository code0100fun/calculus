QUnit.assert.close = function close(actual, expected, maxDifference, message) {
  var actualDiff = (actual === expected) ? 0 : Math.abs(actual - expected),
  result = actualDiff <= maxDifference;
  message = message || (actual + " should be within " + maxDifference + " (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));
  this.push(result, actual, expected, message);
}
