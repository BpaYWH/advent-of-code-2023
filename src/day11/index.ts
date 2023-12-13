import { data, example } from "./data";

const realExpand = (space: string[][]): string[][] => {
   const res = [];

   // row expand
   space.forEach(row => {
      let isEmpty = true;

      for (let i = 0; i < row.length; i++) {
         if (row[i] === "#") {
            isEmpty = false;
            break;
         }
      }

      if (isEmpty) {
         res.push(row);
      }
      res.push(row);
   })

   // col expand
   const cols = [];
   for (let i = 0; i < space[0].length; i++) {
      let isEmpty = true;

      for (let j = 0; j < space.length; j++) {
         if (space[j][i] === "#") {
            isEmpty = false;
            break;
         }
      }

      if (isEmpty) {
         cols.push(i);
      }
   }

   let count = 0;
   cols.forEach(col => {
      res.forEach(row => {
         row.splice(col + count, 0, ".");
      });
      count++;
   });

   return res;
}

export const taskAExpanded = (): number => {
   let res = 0;
   const lines = example.split('\n');
   const space = lines.map(line => {
      return line.split("");
   });
   const expanded = realExpand(space);
   const stars = getStars(expanded);

   for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
         let [x1, y1] = stars[i];
         let [x2, y2] = stars[j];
         if (x1 < x2) {
            [x1, x2] = [x2, x1];
         }
         if (y1 < y2) {
            [y1, y2] = [y2, y1];
         }
         const dist = x1 - x2 + y1 - y2;

         res += dist;
      }
   }

   return res;
}

const expand = (space: string[][]): number[][] => {
   const rows = [];
   const cols = [];

   for (let i = 0; i < space.length; i++) {
      let isEmpty = true;

      for (let j = 0; j < space[i].length; j++) {
         if (space[i][j] === "#") {
            isEmpty = false;
            break;
         }
      }

      if (isEmpty) {
         rows.push(i);
      }
   }

   for (let i = 0; i < space[0].length; i++) {
      let isEmpty = true;

      for (let j = 0; j < space.length; j++) {
         if (space[j][i] === "#") {
            isEmpty = false;
            break;
         }
      }

      if (isEmpty) {
         cols.push(i);
      }
   }

   return [rows, cols];
}

const getStars = (space: string[][]): number[][] => {
   let res = [];
   for (let i = 0; i < space.length; i++) {
      for (let j = 0; j < space[i].length; j++) {
         if (space[i][j] === "#") {
            res.push([i, j]);
         }
      }
   }
   return res;
}


export const taskA = (): number => {
   let res = 0;
   const lines = data.split('\n');
   const space = lines.map(line => {
      return line.split("");
   });
   const [eRows, eCols] = expand(space);
   const stars = getStars(space);

   for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
         let [x1, y1] = stars[i];
         let [x2, y2] = stars[j];
         if (x1 < x2) {
            [x1, x2] = [x2, x1];
         }
         if (y1 < y2) {
            [y1, y2] = [y2, y1];
         }
         const dist = x1 - x2 + y1 - y2;
         let extraRow = 0;
         let extraCol = 0;
         for (let k = 0; k < eRows.length; k++) {
            if (eRows[k] < x1 && eRows[k] > x2) {
               extraRow++;
            }
         }
         for (let k = 0; k < eCols.length; k++) {
            if (eCols[k] < y1 && eCols[k] > y2) {
               extraCol++;
            }
         }
         res += dist + extraRow + extraCol;
      }
   }
   return res;
}

const factor = 1000000;

export const taskB = (): number => {
   let res = 0;
   const lines = data.split('\n');
   const space = lines.map(line => {
      return line.split("");
   });
   const [eRows, eCols] = expand(space);
   const stars = getStars(space);

   for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
         let [x1, y1] = stars[i];
         let [x2, y2] = stars[j];
         if (x1 < x2) {
            [x1, x2] = [x2, x1];
         }
         if (y1 < y2) {
            [y1, y2] = [y2, y1];
         }
         const dist = x1 - x2 + y1 - y2;
         let extraRow = 0;
         let extraCol = 0;
         for (let k = 0; k < eRows.length; k++) {
            if (eRows[k] < x1 && eRows[k] > x2) {
               extraRow++;
            }
         }
         for (let k = 0; k < eCols.length; k++) {
            if (eCols[k] < y1 && eCols[k] > y2) {
               extraCol++;
            }
         }
         res += dist + extraRow * (factor - 1) + extraCol  * (factor - 1);
      }
   }

   return res;
}
