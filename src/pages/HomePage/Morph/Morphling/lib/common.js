export const arrayToMatrix = (arr) => {
  const matrix = [];
  for (let i = 0; i < arr.length - 1; i += 2) {
    matrix.push([
      arr[i],
      arr[i + 1],
    ]);
  }
  return matrix;
};

export const inPoly = (x, y, matrix) => {
  const npol = matrix.length;
  let j = npol - 1;
  let c = 0;
  for (let i = 0; i < npol; i += 1) {
    // eslint-disable-next-line
    if ((((matrix[i][1] <= y) && (y < matrix[j][1])) || ((matrix[j][1] <= y) && (y < matrix[i][1]))) && (x > (matrix[j][0] - matrix[i][0]) * (y - matrix[i][1]) / (matrix[j][1] - matrix[i][1]) + matrix[i][0])) {
      c = !c;
    }
    j = i;
  }
  return c;
};

/* eslint-disable */
export const drawImageProp = (ctx, img, x, y, w, h, offsetX, offsetY) => {

  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = offsetX
    ? offsetX
    : 0.5;
  offsetY = offsetY
    ? offsetY
    : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0)
    offsetX = 0;
  if (offsetY < 0)
    offsetY = 0;
  if (offsetX > 1)
    offsetX = 1;
  if (offsetY > 1)
    offsetY = 1;

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, /// new prop. width
    nh = ih * r, /// new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1;

  // decide which gap to fill
  if (nw < w)
    ar = w / nw;
  if (nh < h)
    ar = h / nh;
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0)
    cx = 0;
  if (cy < 0)
    cy = 0;
  if (cw > iw)
    cw = iw;
  if (ch > ih)
    ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

export const getNextItemIndex = (curentIndex, collection) =>
  ((curentIndex + 1) % collection.length);
