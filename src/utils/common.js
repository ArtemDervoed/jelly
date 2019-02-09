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
