import { data, exam } from "./data";

const validate = (line: string[], seq: number[]): boolean => {
   let newLine = [];
   let temp = 0;
   for (let i = 0; i < line.length; i++) {
      if (line[i] === '.') {
         if (temp) {
            newLine.push(temp);
            temp = 0;
         }
      } else {
         temp++;
      }
   }
   if (temp) {
      newLine.push(temp);
   }

   if (newLine.length !== seq.length) {
      return false;
   }
   
   // console.log(newLine, seq)
   for (let i = 0; i < seq.length; i++) {
      if (newLine[i] !== seq[i]) {
         return false;
      }
   }

   return true;
}

const backtrack = (line: string[], uPos: number[], seq: number[], posStep: number, seqStep: number, visited: Set<string> = new Set()): number => {
   if (visited.has(line.join(""))) {
      return 0;
   }
   if (posStep === uPos.length) {
      const valid = validate(line, seq);
      visited.add(line.join(""));
      if (valid) {
         // console.log(line.join(""), seq, "ok")
         return 1;
      }
      return 0;
   };
   let count = 0;

   // uPos damaged
   let dLine = [...line];
   let dCount = 0;
   dLine[uPos[posStep]] = '#';
   dCount += backtrack(dLine, uPos, seq, posStep + 1, seqStep + 1, visited);
   visited.add(dLine.join(""));
   
   dLine[uPos[posStep]] = '.';
   dCount += backtrack(dLine, uPos, seq, posStep + 1, seqStep + 1, visited);
   visited.add(dLine.join(""));

   dCount += backtrack(dLine, uPos, seq, posStep + 1, seqStep, visited);
   visited.add(dLine.join(""));
   visited.add(line.join(""));

   return count + dCount;
}

const getWays = (line: string[], seq: number[]): number => {
   const uPos = [];
   for (let i = 0; i < line.length; i++) {
      if (line[i] === '?') {
         uPos.push(i);
      }
   }

   return backtrack(line, uPos, seq, 0, 0);
}

export const taskA = (): number => {
   let res = 0;
   const lines = data.split('\n');

   lines.forEach(line => {
      const [parts, seqStr] = line.split(' ');
      res += getWays2(parts.trim().split(""), seqStr.trim().split(",").map(seq => parseInt(seq)));
   });

   return res;
}

const mem = (func: (line: string[], seq: number[]) => number): (line: string[], seq: number[]) => number => {
   const cache: { [record: string]: number } = {};
   return (line: string[], seq: number[]): number => {
      const record = line.join("") + seq.join("");
      if (record in cache) {
         return cache[record];
      }
      const res = func(line, seq);
      cache[record] = res;
      return res; 
   }
}

const getWays2 = mem((line: string[], seq: number[]): number => {
   if (line.length === 0) {
      if (seq.length === 0) {
         return 1;
      }
      return 0;
   }
   if (seq.length === 0) {
      for (let i = 0; i < line.length; i++) {
         if (line[i] === "#") {
            return 0;
         }
      }
      return 1;
   }
   const requiredLength = seq.reduce((a, b) => a + b, 0) + seq.length - 1;
   if (line.length < requiredLength) {
      return 0;
   }

   if (line[0] === ".") {
      return getWays2(line.slice(1), seq);
   }

   if (line[0] === "#") {
      for (let i = 0; i < seq[0]; i++) {
         if (line[i] === ".") {
            return 0;
         }
      }
      if (line[seq[0]] === "#") {
         return 0;
      }

      return getWays2(line.slice(seq[0] + 1), seq.slice(1));
   }

   return getWays2(["#", ...line.slice(1)], seq) + getWays2([".", ...line.slice(1)], seq);
})

export const taskB = (): number => {
   let res = 0;
   const lines = data.split('\n');

   lines.forEach(line => {
      const [parts, seqStr] = line.split(' ');
      const seqArr = seqStr.trim().split(",").map(seq => parseInt(seq));
      const newLine = [parts, parts, parts, parts, parts].join("?").split("");
      const newSeq = [...seqArr, ...seqArr, ...seqArr, ...seqArr, ...seqArr];
      const newWay = getWays2(newLine, newSeq);
      res += newWay;
   });

   return res;
}
