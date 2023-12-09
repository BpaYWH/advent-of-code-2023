import { message } from "./data";

const lines = message.split("\n");
const numMap: Record<string, number>  = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9
};

const matchNum = (subline: string, first: boolean): number => {
	if (subline.length === 0) return 0;

	const valids: number[][] = [];

	Object.keys(numMap).forEach(numStr => {
		let index = -1;
		while (true) {
			index = subline.indexOf(numStr, index + 1);
			
			if (index === -1) break;

			valids.push([index, numMap[numStr]]);
		}
	});

	if (valids.length === 0) {
		return 0;
	}
	
	console.log(first ? "first " : "last ", subline, valids)
	if (first) {
		valids.sort((a, b) => a[0] - b[0]);
		return valids[0][1];
	}

	valids.sort((a, b) => b[0] - a[0]);
	return valids[0][1];
}

const calVal = (line: string): number => {
	let sum = 0;

	let firstOccur = line.length;
	let lastOccur = -1;

	for (let i = 0; i < line.length; i++) {
		if (!isNaN(Number(line[i]))) {
			firstOccur = i;
			break;
		}
	}

	// need select the first or last valid
	const firstVal = matchNum(line.substring(0, firstOccur), true);
	if (firstVal === 0) {
		sum += Number(line[firstOccur]);
	} else {
		sum += firstVal;
	}
	sum *= 10;

	for (let i = line.length - 1; i >= 0; i--) {
		if (!isNaN(Number(line[i]))) {
			lastOccur = i;
			break;
		}
	}

	const lastVal = matchNum(line.substring(lastOccur + 1), false);
	lastVal === 0 ? sum += Number(line[lastOccur]) : sum += lastVal;

	return sum;
}

export const taskB = (): number => {
	let sum = 0;

	lines.forEach(line => {
		const res = calVal(line);
		// console.log(res);
		sum += res;
	});

	console.log(sum)

	return sum;
}