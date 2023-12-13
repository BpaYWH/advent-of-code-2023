import { data, example } from "./data";

const formPuz = (pat: string): string[] => {
   return pat.split("\n");
}

const findPattern = (pat: string): number => {
   let res = 0;
   const puzz = formPuz(pat);
   // console.log(puzz.length, puzz[0].length)

   // hori
   for (let i = 0; i < puzz[0].length - 1; i++) {
      // min of left & right
      let left = i + 1;
      let right = puzz[0].length - i - 1;
      let ref = Math.min(left, right);

      // compare left & right of each row
      // console.info("checking hori", left);
      let isHori = true;
      for (let j = 0; j < ref; j++) {
         for (let k = 0; k < puzz.length; k++) {
            if (puzz[k][i - j] !== puzz[k][i + 1 + j]) {
               isHori = false;
               break;
            }
         }
         if (!isHori) {
            break;
         }
      }
      if (isHori) {
         // console.log("found");
         return i + 1;
      }
   }

   // vert
   for (let i = 0; i < puzz.length - 1; i++) {
      let top = i + 1;
      let bottom = puzz.length - i - 1;
      let ref = Math.min(top, bottom);

      // console.info("checking vert", top);
      let isVert = true;
      for (let j = 0; j < ref; j++) {
         for (let k = 0; k < puzz[0].length; k++) {
            if (puzz[i - j][k] !== puzz[i + 1 + j][k]) {
               isVert = false;
               break;
            }
         }
         if (!isVert) {
            break;
         }
      }
      if (isVert) {
         // console.log("found");
         return (i + 1) * 100;
      }
   }


   return res;
}

export const taskA = (): number => {
   let res = 0;

   const pat = data.split("\n\n");
   pat.forEach(p => {
      res += findPattern(p);
   });

   return res;
}

const findPattern2 = (pat: string, prev: number): number => {
   let res = 0;
   const puzz = formPuz(pat);
   let quota = 1;

   // hori
   for (let i = 0; i < puzz[0].length - 1; i++) {
      // min of left & right
      let left = i + 1;
      let right = puzz[0].length - i - 1;
      let ref = Math.min(left, right);

      // compare left & right of each row
      let isHori = true;
      quota = 1;
      for (let j = 0; j < ref; j++) {
         for (let k = 0; k < puzz.length; k++) {
            if (puzz[k][i - j] !== puzz[k][i + 1 + j]) {
               if (quota) {
                  quota--;
               } else {
                  isHori = false;
                  break;
               }
            }
         }
         if (!isHori) {
            break;
         }
      }
      if (isHori && (i + 1 !== prev)) {
         return i + 1;
      }
   }

   // vert
   for (let i = 0; i < puzz.length - 1; i++) {
      let top = i + 1;
      let bottom = puzz.length - i - 1;
      let ref = Math.min(top, bottom);

      let isVert = true;
      quota = 1;
      for (let j = 0; j < ref; j++) {
         for (let k = 0; k < puzz[0].length; k++) {
            if (puzz[i - j][k] !== puzz[i + 1 + j][k]) {
               if (quota) {
                  quota--;
               } else {
                  isVert = false;
                  break;
               }
            }
         }
         if (!isVert) {
            break;
         }
      }
      if (isVert && ((i + 1) * 100) !== prev) {
         return (i + 1) * 100;
      }
   }


   return res;
}

export const taskB = (): number => {
   let res = 0;
   const pat = data.split("\n\n");

   for (let i = 0; i < pat.length; i++) {
      const prev = findPattern(pat[i]);
      res += findPattern2(pat[i], prev);
   }

   return res;
}
