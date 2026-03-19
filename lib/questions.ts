export type Operation = "division" | "multiplication" | "addition" | "subtraction" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  prompt: string;
  answer: number;
  operation: Exclude<Operation, "mixed">;
  hint?: string;
}

const EASY_DIVISORS = [2, 4, 5, 10, 20, 25, 50, 100];
const MEDIUM_DIVISORS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100, 200];
const HARD_DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 20, 25, 50, 100, 200, 250, 500];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

const divisionPrompts = [
  (total: number, per: number) =>
    `We need ${total.toLocaleString()} units. Each case holds ${per}. How many cases do we need to order?`,
  (total: number, per: number) =>
    `There are ${total.toLocaleString()} items to pack. Each box holds ${per}. How many boxes are needed?`,
  (total: number, per: number) =>
    `We received an order for ${total.toLocaleString()} pieces. Each pallet holds ${per}. How many pallets do we need?`,
  (total: number, per: number) =>
    `${total.toLocaleString()} units need to ship. Each shipment contains ${per} units. How many shipments is that?`,
  (total: number, per: number) =>
    `A customer wants ${total.toLocaleString()} items. They come in packs of ${per}. How many packs do they need?`,
  (total: number, per: number) =>
    `We need to fill an order of ${total.toLocaleString()} parts. Each kit contains ${per} parts. How many kits?`,
  (total: number, per: number) =>
    `${total.toLocaleString()} units are on the floor. They are grouped in sets of ${per}. How many sets?`,
];

const multiplicationPrompts = [
  (count: number, per: number) =>
    `We ordered ${count} cases. Each case contains ${per} units. How many units total?`,
  (count: number, per: number) =>
    `There are ${count} pallets. Each holds ${per} items. What is the total item count?`,
  (count: number, per: number) =>
    `We have ${count} boxes, each with ${per} pieces inside. How many pieces do we have?`,
  (count: number, per: number) =>
    `${count} shipments arrived. Each contains ${per} units. How many units did we receive?`,
  (count: number, per: number) =>
    `A supplier sent ${count} bundles of ${per} items each. What is the total?`,
  (count: number, per: number) =>
    `We need to fill ${count} orders, each requiring ${per} units. How many units total?`,
];

const additionPrompts = [
  (a: number, b: number) =>
    `We have ${a.toLocaleString()} units in stock and just received a shipment of ${b.toLocaleString()} more. What is our new total?`,
  (a: number, b: number) =>
    `Morning count was ${a.toLocaleString()} items. We added ${b.toLocaleString()} during the day. What is the end-of-day count?`,
  (a: number, b: number) =>
    `Warehouse A has ${a.toLocaleString()} units. Warehouse B has ${b.toLocaleString()}. What is the combined inventory?`,
  (a: number, b: number) =>
    `We produced ${a.toLocaleString()} units this week and ${b.toLocaleString()} last week. What is the two-week total?`,
];

const subtractionPrompts = [
  (a: number, b: number) =>
    `We started with ${a.toLocaleString()} units in stock. We shipped out ${b.toLocaleString()}. How many remain?`,
  (a: number, b: number) =>
    `Inventory shows ${a.toLocaleString()} items. An audit found ${b.toLocaleString()} missing. What is the adjusted count?`,
  (a: number, b: number) =>
    `We need ${a.toLocaleString()} units for an order but only have ${b.toLocaleString()} in stock. How many do we still need?`,
  (a: number, b: number) =>
    `A batch of ${a.toLocaleString()} items was produced. ${b.toLocaleString()} were rejected. How many passed?`,
];

function generateDivision(difficulty: Difficulty): Question {
  const divisors =
    difficulty === "easy" ? EASY_DIVISORS :
    difficulty === "medium" ? MEDIUM_DIVISORS :
    HARD_DIVISORS;

  const per = pick(divisors);
  const maxQuotient = difficulty === "easy" ? 20 : difficulty === "medium" ? 50 : 100;
  const quotient = rand(2, maxQuotient);
  const total = per * quotient;

  return {
    prompt: pick(divisionPrompts)(total, per),
    answer: quotient,
    operation: "division",
    hint: `${total.toLocaleString()} ÷ ${per}`,
  };
}

function generateMultiplication(difficulty: Difficulty): Question {
  const divisors =
    difficulty === "easy" ? EASY_DIVISORS :
    difficulty === "medium" ? MEDIUM_DIVISORS :
    HARD_DIVISORS;

  const per = pick(divisors);
  const maxCount = difficulty === "easy" ? 20 : difficulty === "medium" ? 50 : 100;
  const count = rand(2, maxCount);
  const answer = count * per;

  return {
    prompt: pick(multiplicationPrompts)(count, per),
    answer,
    operation: "multiplication",
    hint: `${count} × ${per}`,
  };
}

function generateAddition(difficulty: Difficulty): Question {
  const step = difficulty === "easy" ? 50 : difficulty === "medium" ? 25 : 1;
  const max = difficulty === "easy" ? 1000 : difficulty === "medium" ? 5000 : 10000;
  const a = rand(100, max, step);
  const b = rand(50, max / 2, step);

  return {
    prompt: pick(additionPrompts)(a, b),
    answer: a + b,
    operation: "addition",
    hint: `${a.toLocaleString()} + ${b.toLocaleString()}`,
  };
}

function generateSubtraction(difficulty: Difficulty): Question {
  const step = difficulty === "easy" ? 50 : difficulty === "medium" ? 25 : 1;
  const max = difficulty === "easy" ? 1000 : difficulty === "medium" ? 5000 : 10000;
  const a = rand(200, max, step);
  const b = rand(50, a - 50, step);

  return {
    prompt: pick(subtractionPrompts)(a, b),
    answer: a - b,
    operation: "subtraction",
    hint: `${a.toLocaleString()} − ${b.toLocaleString()}`,
  };
}

export function generateQuestion(operation: Operation, difficulty: Difficulty): Question {
  const ops: Exclude<Operation, "mixed">[] = ["division", "multiplication", "addition", "subtraction"];
  const op = operation === "mixed" ? pick(ops) : operation;

  switch (op) {
    case "division": return generateDivision(difficulty);
    case "multiplication": return generateMultiplication(difficulty);
    case "addition": return generateAddition(difficulty);
    case "subtraction": return generateSubtraction(difficulty);
  }
}

export function generateQuestions(
  operation: Operation,
  difficulty: Difficulty,
  count: number
): Question[] {
  return Array.from({ length: count }, () => generateQuestion(operation, difficulty));
}
