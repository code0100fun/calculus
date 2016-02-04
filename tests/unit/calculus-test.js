import { add } from 'calculus';

QUnit.module('calculus');

test("adds numbers", function(assert) {
  assert.equal(add(1,2), 3, '1 + 2 = 3');
});
