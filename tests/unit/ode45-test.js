import { ode45 } from 'calculus';
import { indexInterpolate, binarySearch, pluckTimes } from 'differential-equations/ordinary/ode45';

QUnit.module('ode45');

test("binary search", function(assert) {
  const t = 1.0;
  const T = [0.0, 0.75, 1.50, 2.25];
  const [min, max] = binarySearch(t, T);
  assert.equal(min, 1);
  assert.equal(max, 2);
});

test("binary search exact index", function(assert) {
  const t = 2.0;
  const T = [1, 2, 3];
  const [min, max] = binarySearch(t, T);
  assert.equal(min, 1);
  assert.equal(max, 1);
});

test("index interpolation", function(assert) {
  const t = 1.0;
  const T = [0.0, 0.75, 1.25, 2.50];
  const i = indexInterpolate(t, T);
  assert.equal(i, 1.5);
});

test("index interpolation exact index", function(assert) {
  const t = 3;
  const T = [0, 1, 2, 3, 4];
  const i = indexInterpolate(t, T);
  assert.equal(i, 3);
});

test("index interpolation last index", function(assert) {
  const t = 4;
  const T = [0, 1, 4];
  const i = indexInterpolate(t, T);
  assert.equal(i, 2);
});

test("precise index interpolation", function(assert) {
  const t = 9999999;
  const T = [0, 10000000];
  const i = indexInterpolate(t, T);
  assert.equal(i, 0.9999999);
});

test("pluck times", function(assert) {
  const t = [1, 2];
  const T = [0, 1, 2, 3];
  const Y = [1, 2, 3, 4];
  const [a, b] = pluckTimes(t, T, Y);
  assert.equal(a, 2);
  assert.equal(b, 3);
});

test("pluck interpolation", function(assert) {
  const t = [0, 1.5];
  const T = [0, 1, 2, 3];
  const Y = [1, 2, 3, 4];
  const [a, b] = pluckTimes(t, T, Y);
  assert.equal(a, 1);
  assert.equal(b, 2.5);
});

test("solves a first order ODE with for each t in tspan", function(assert) {
  const y0 = 1;
  const tspan = [0, 1, 2];
  const [t, y] = ode45((t,h) => 2, tspan, y0);
  assert.equal(t[0], 0, 'time 0');
  assert.equal(t[1], 1, 'time 1');
  assert.equal(t[2], 2, 'time 2');
  assert.close(y[0], 1, 1e-12, 'y0 = 1');
  assert.close(y[1], 3, 1e-12, 'y1 = 3');
  assert.close(y[2], 5, 1e-12, 'y2 = 5');
});
