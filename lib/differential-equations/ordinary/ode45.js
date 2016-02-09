const sixth = 1/6;

function rungeKutta(fn, x, y, h) {
  const h2 = h * 0.5;
  const k1 = h * fn(x, y);
  const k2 = h * fn(x + h2, y + k1 * h2);
  const k3 = h * fn(x + h2, y + k2 * h2);
  const k4 = h * fn(x + h,  y + k3 * h);
  return y + sixth * (k1 + 2 * k2 + 2 * k3 + k4);
}

function binarySearch(t, T) {
  let iMin = 0;
  let iMax = T.length - 1;
  while (iMax - iMin > 1) {
    const i = iMin + Math.round((iMax - iMin)/2);
    const ti = T[i];
    if (ti < t) {
      iMin = i;
    } else if (ti > t) {
      iMax = i;
    } else {
      iMin = i;
      iMax = i;
    }
  }
  return [iMin, iMax];
}

function indexInterpolate(t, T) {
  let [iMin, iMax] = binarySearch(t, T);
  if (iMin === iMax) {
    return iMin;
  }
  const tiMin = T[iMin];
  const tiMax = T[iMax];
  const interp = (t - tiMin) / (tiMax - tiMin);
  let index = iMin + interp;
  index = Math.min(T.length - 1, index);
  index = Math.max(0, index);
  return index;
}

function pluckTimes(t, T, Y) {
  const y = [];
  for (let i = 0; i < t.length; i++) {
    const ti = t[i];
    const j = indexInterpolate(ti, T);
    const jMin = Math.floor(j);
    const jMax = Math.ceil(j);
    if (jMax === j) {
      y.push(Y[j]);
    } else {
      const y1 = Y[jMin];
      const y2 = Y[jMax];
      const interp = j - jMin;
      const value = y1 + (y2 - y1) * interp;
      y.push(value);
    }
  }
  return y;
}

export { indexInterpolate, binarySearch, pluckTimes };

export default function(fn, domain, initial) {
  const T = [];
  const Y = [];
  const h = 1e-3;
  let yt = initial;
  let t = domain[0];
  let tMax = domain[domain.length - 1];
  Y.push(yt);
  T.push(t);
  while (t < tMax) {
    t += h;
    yt = rungeKutta(fn, t, yt, h);
    Y.push(yt);
    T.push(t);
  }

  return [domain, pluckTimes(domain, T, Y)];
}
