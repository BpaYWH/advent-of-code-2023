import { data, example } from "./data";

const calVal = (str: string): number => {
   let res = 0;

   for (let i = 0; i < str.length; i++) {
      const ascii = str.charCodeAt(i);
      res += ascii;
      res *= 17;
      res %= 256;
   }

   return res;
}

export const taskA = (): number => {
   let res = 0;

   const steps = data.split(",");
   steps.forEach(step => {
      res += calVal(step);
   });

   return res;
}

const fillBoxes = (boxes: [string, number][][], len: string) => {
   if (len.search("=") !== -1) {
      const [label, focal] = len.split("=");
      const no = calVal(label);

      if (!boxes[no]) {
         boxes[no] = [];
      }
      for (let i = 0; i < boxes[no].length; i++) {
         if (boxes[no][i][0] === label) {
            boxes[no][i][1] = parseInt(focal);
            return;
         }
      }

      boxes[no].push([label, parseInt(focal)]);
   } else {
      const [label,] = len.split("-");
      const no = calVal(label);
      
      if (!boxes[no]) {
         boxes[no] = [];
      }
      for (let i = 0; i < boxes[no].length; i++) {
         if (boxes[no][i][0] === label) {
            // remove i from boxes[no]
            boxes[no].splice(i, 1);
            return;
         }
      }
   }
}

export const taskB = (): number => {
   let res = 0;

   const lens = data.split(",");
   const boxes: [string, number][][] = new Array(256);

   lens.forEach(len => {
      fillBoxes(boxes, len);
   });

   for (let i = 0; i < boxes.length; i++) {
      if (!boxes[i]) continue;
      for (let j = 0; j < boxes[i].length; j++) {
         res += (i + 1) * (j + 1) * boxes[i][j][1];
      }
   }

   return res;
}
