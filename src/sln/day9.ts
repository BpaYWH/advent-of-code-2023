import { data } from "../input/d9";


const helper = (nums: number[]): number => {
   if (nums.filter(num => num === 0).length === nums.length) {
      return 0;
   }

   let next: number[] = [];
   for (let i = 1; i < nums.length; i++) {
      next.push(nums[i] - nums[i - 1]);
   }

   return nums[nums.length - 1] + helper(next);
}

const cal = (line: string): number => {
   const strs = line.split(' ');
   const nums = strs.map(str => parseInt(str));

   return helper(nums);
}

export const taskA = (): void => {
   const lines = data.split('\n');
   let res = 0;

   lines.forEach(line => {
      res += cal(line);
   });

   console.log(res);
}

const helperB = (nums: number[]): number => {
   // console.log(nums);
   if (nums.filter(num => num === 0).length === nums.length) {
      return 0;
   }

   let next: number[] = [];
   for (let i = 1; i < nums.length; i++) {
      next.push(nums[i] - nums[i - 1]);
   }

   const val = helperB(next);

   return nums[0] - val;
}

const calB = (line: string): number => {
   const strs = line.split(' ');
   const nums = strs.map(str => parseInt(str));

   return helperB(nums);
}

export const taskB = (): void => {
   const lines = data.split('\n');
   let res = 0;

   lines.forEach(line => {
      res += calB(line);
   });

   console.log(res);
}