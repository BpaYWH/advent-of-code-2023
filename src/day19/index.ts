import { data, example } from "./data";

const signMap = {
   ">": (a: number, target: number) => a > target,
   "<": (a: number, target: number) => a < target,
}

const formRules = (strs: string[]): { [flow: string]: { partName: string, val: number, sign: string, nextFlow: string }[] }  => {
   const res = {};

   strs.forEach(str => {
      const [flow, ruleStrs] = str.replace("}", "").split("{");
      const rules = ruleStrs.split(",");
      res[flow] = [];
      rules.forEach(rule => {
         if (rule.indexOf(":") === -1) {
            res[flow].push({ partName: "*", val: 0, sign: "*", nextFlow: rule });
         } else {
            const [partWithVal, nextFlow] = rule.split(":");
            const part = partWithVal.charAt(0);
            const val = parseInt(partWithVal.slice(1).replace("<", "").replace(">", ""));
            res[flow].push({ partName: part, val, sign: partWithVal.charAt(1), nextFlow });
         }
      });
   });

   return res;
}
const preprocessParts = (strs: string[]): { [name: string]: number }[] => {
   const res = [];

   strs.forEach(str => {
      const eles = str.replace("{", "").replace("}", "").split(",");
      const part = {};
      eles.forEach(eleStr => {
         const [ele, valStr] = eleStr.split("=");
         part[ele] = parseInt(valStr);
      });
      res.push(part);
   });

   return res;
}

const dfs = (rules, part, flow) => {
   if (flow === "R") {
      return false;
   }
   if (flow === "A") {
      return true;
   }

   for (const rule of rules[flow]) {
      const partName = rule.partName;
      if (partName in part) {
         if (signMap[rule.sign](part[partName], rule.val)) {
            return dfs(rules, part, rule.nextFlow);
         }
      }
      if (partName === "*") {
         return dfs(rules, part, rule.nextFlow);
      }
   }

   return false;
}

export const taskA = (): number => {
   let res = 0;

   const [ruleStrs, partStrs] = data.split("\n\n");
   const ruleStr = ruleStrs.split("\n");
   const partStr = partStrs.split("\n");

   const rules = formRules(ruleStr);
   const parts = preprocessParts(partStr);
   const accepted: { [name: string]: number }[] = [];

   for (const part of parts) {
      if (dfs(rules, part, "in")) {
         accepted.push(part);
      }
   };

   for (const part of accepted) {
      for (const [, val] of Object.entries(part)) {
         res += val;
      }
   };

   return res;
}

const partId = {
   "x": 0,
   "m": 1,
   "a": 2,
   "s": 3
};

const sliceIntv = (intv: number[], range: number[]): number[][] => {
   if (intv.length === 0) {
      return [[], []];
   }

   const res = [];

   if (intv[1] < range[0] || intv[0] > range[1]) {
      res.push([]);
      res.push(intv);
      return res;
   }

   // within range
   if (intv[0] >= range[0] && intv[1] <= range[1]) {
      res.push(intv);
      res.push([]);
      return res;
   }

   // partly within
   if (intv[0] <= range[1] && intv[1] > range[1]) {
      res.push([intv[0], range[1]]);
      res.push([range[1] + 1, intv[1]]);
      return res;
   }
   if (intv[0] < range[0] && intv[1] >= range[0]) {
      res.push([range[0], intv[1]]);
      res.push([intv[0], range[0] - 1]);
      return res;
   }

   return [[], []];
}

const findRange = (val: number, sign: string): number[] => {
   if (sign === "<") {
      return [1, val - 1];
   }
   if (sign === ">") {
      return [val + 1, 4000];
   }
   return [-1, -1];
}

const match = (rules, part, flow, accepted) => {
   if (flow === "R") {
      return;
   }
   if (flow === "A") {
      accepted.push([...part]);
      return;
   }

   let dupPart = [...part];

   for (const rule of rules[flow]) {
      const partName = rule.partName;
      if (partName === "*") {
         match(rules, dupPart, rule.nextFlow, accepted);
      } else {
         const range = findRange(rule.val, rule.sign);
         const [sliced, inverted] = sliceIntv(dupPart[partId[partName]], range);

         if (sliced.length > 0) {
            dupPart[partId[partName]] = [...sliced];
            match(rules, dupPart, rule.nextFlow, accepted);
         }

         dupPart[partId[partName]] = [...inverted];
      }
   }

   return;
}

export const taskB = (): number => {
   let res = 0;

   const [ruleStrs,] = data.split("\n\n");
   const ruleStr = ruleStrs.split("\n");
   const rules = formRules(ruleStr);

   const parts = new Array(4).fill(0).map(() => [1, 4000]);
   const accepted = [];
   match(rules, parts, "in", accepted);

   // cal
   for (const part of accepted) {
      let temp = 1;
      for (const val of part) {
         temp *= val[1] - val[0] + 1;
      }
      res += temp;
   }

   return res;
}
