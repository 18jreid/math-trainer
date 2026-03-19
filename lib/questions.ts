export type Operation = "division" | "multiplication" | "addition" | "subtraction" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  prompt: string;
  answer: number;
  operation: Exclude<Operation, "mixed">;
  hint?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min: number, max: number, step = 1): number {
  const steps = Math.floor((max - min) / step);
  return min + Math.floor(Math.random() * (steps + 1)) * step;
}

// ─── Divisors by difficulty ──────────────────────────────────────────────────

const EASY_DIVISORS   = [2, 4, 5, 10, 20, 25, 50, 100];
const MEDIUM_DIVISORS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 50, 100];
const HARD_DIVISORS   = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 20, 25, 50, 100, 200, 250];

// ─── Division prompts ────────────────────────────────────────────────────────
// "We have [total], each [unit] holds [per], how many [units]?"

const divisionPrompts: ((total: number, per: number) => string)[] = [
  // Biote NutraPack
  (t, p) => `We received ${t.toLocaleString()} NutraPack supplement capsules. Each daily packet contains ${p} capsules. How many day-supply packets can we make?`,
  // B12 vials
  (t, p) => `The clinic has ${t.toLocaleString()} B12 injection doses in stock. Each patient kit contains ${p} doses. How many patient kits can we fill?`,
  // Hormone pellet insertions
  (t, p) => `Dr. Rodgers has ${t.toLocaleString()} hormone pellets to distribute. Each insertion procedure uses ${p} pellets. How many procedures can be performed?`,
  // IV bags
  (t, p) => `We have ${t.toLocaleString()} mL of IV solution prepared. Each IV bag holds ${p} mL. How many IV bags can we fill?`,
  // Semaglutide doses
  (t, p) => `The pharmacy delivered ${t.toLocaleString()} units of semaglutide. Each patient's weekly dose is ${p} units. How many weekly doses is that?`,
  // Acousana sessions
  (t, p) => `We have ${t.toLocaleString()} Acousana therapy credits available. Each patient requires ${p} sessions per treatment protocol. How many patients can we treat?`,
  // Vitamin D vials
  (t, p) => `We ordered ${t.toLocaleString()} Vitamin D injection doses. Each box holds ${p} doses. How many boxes did we receive?`,
  // Weight loss check-ins
  (t, p) => `There are ${t.toLocaleString()} Mastery Program check-in appointments to schedule. Each provider can see ${p} patients per day. How many provider-days are needed?`,
  // Supplement orders
  (t, p) => `We need to pack ${t.toLocaleString()} supplement capsules for patient home delivery. Each bottle holds ${p} capsules. How many bottles do we need?`,
  // Consult slots
  (t, p) => `We have ${t.toLocaleString()} minutes of consultation time available this week. Each new patient consult takes ${p} minutes. How many new patients can we see?`,
];

// ─── Multiplication prompts ──────────────────────────────────────────────────

const multiplicationPrompts: ((count: number, per: number) => string)[] = [
  // NutraPack monthly supply
  (c, p) => `We are fulfilling orders for ${c} patients enrolled in the Mastery Program. Each patient needs a ${p}-day NutraPack supply. How many daily packets do we need to pack total?`,
  // B12 kits
  (c, p) => `${c} patients are starting B12 injection therapy. Each patient's starter kit includes ${p} pre-filled syringes. How many syringes do we need to prepare?`,
  // Acousana sessions
  (c, p) => `${c} new patients are beginning Acousana therapy. Each patient's full protocol is ${p} sessions. How many total sessions will be scheduled?`,
  // Semaglutide weekly doses
  (c, p) => `We have ${c} active semaglutide patients. Each patient uses ${p} units per week. How many total units do we dispense per week?`,
  // Pellet revenue
  (c, p) => `The clinic performed ${c} women's hormone pellet insertions this month at $${p} each. What is the total revenue?`,
  // Supplement capsules
  (c, p) => `We are shipping supplement orders to ${c} patients. Each order contains ${p} capsules. How many capsules will we ship in total?`,
  // IV therapy prep
  (c, p) => `${c} patients are scheduled for IV vitamin therapy today. Each IV bag requires ${p} mL of solution. How many mL of solution do we need to prepare?`,
  // Consultation blocks
  (c, p) => `We have ${c} providers on staff today, each with ${p} available consultation slots. How many patient slots are available clinic-wide?`,
  // Weight loss program revenue
  (c, p) => `${c} patients enrolled in the One Wellness Mastery Program at $${p} each. What is the total program revenue?`,
];

// ─── Addition prompts ────────────────────────────────────────────────────────

const additionPrompts: ((a: number, b: number) => string)[] = [
  (a, b) => `We had ${a.toLocaleString()} B12 injection doses in stock this morning. A shipment of ${b.toLocaleString()} more just arrived. What is our new B12 inventory?`,
  (a, b) => `Dr. Rodgers has performed ${a.toLocaleString()} hormone pellet insertions to date. He completed ${b.toLocaleString()} more this month. What is his new total?`,
  (a, b) => `The clinic had ${a.toLocaleString()} NutraPack capsules on hand. We just received a restock order of ${b.toLocaleString()} capsules. What is the total capsule count?`,
  (a, b) => `${a.toLocaleString()} patients are currently enrolled in the weight loss program. ${b.toLocaleString()} new patients joined this week. How many total active patients are there?`,
  (a, b) => `We dispensed ${a.toLocaleString()} units of semaglutide last month and ${b.toLocaleString()} units this month. What is the two-month total?`,
  (a, b) => `The clinic earned $${a.toLocaleString()} from hormone pellet procedures and $${b.toLocaleString()} from Mastery Program enrollments this week. What is the combined revenue?`,
  (a, b) => `We have ${a.toLocaleString()} mL of IV solution in the main fridge and ${b.toLocaleString()} mL in the back storage. What is the total IV solution on hand?`,
  (a, b) => `${a.toLocaleString()} Acousana sessions were completed in the first half of the month and ${b.toLocaleString()} in the second half. What was the monthly total?`,
];

// ─── Subtraction prompts ─────────────────────────────────────────────────────

const subtractionPrompts: ((a: number, b: number) => string)[] = [
  (a, b) => `We started the week with ${a.toLocaleString()} B12 injection doses. We administered ${b.toLocaleString()} doses to patients. How many doses remain?`,
  (a, b) => `The clinic had ${a.toLocaleString()} semaglutide units in stock. We dispensed ${b.toLocaleString()} units this week. How many units are left?`,
  (a, b) => `We ordered ${a.toLocaleString()} NutraPack capsules for the month. So far ${b.toLocaleString()} capsules have been packed into patient orders. How many capsules are still unpacked?`,
  (a, b) => `There are ${a.toLocaleString()} minutes of appointment time available this week. ${b.toLocaleString()} minutes have already been booked. How many minutes of open availability remain?`,
  (a, b) => `We received ${a.toLocaleString()} Vitamin D injection doses. ${b.toLocaleString()} have already been administered. How many doses are still available?`,
  (a, b) => `The Mastery Program budget for supplements this quarter is $${a.toLocaleString()}. We have spent $${b.toLocaleString()} so far. How much budget remains?`,
  (a, b) => `We had ${a.toLocaleString()} hormone pellets in stock. Dr. Rodgers used ${b.toLocaleString()} for insertion procedures this week. How many pellets remain?`,
  (a, b) => `${a.toLocaleString()} patients were enrolled in the weight loss program at the start of the quarter. ${b.toLocaleString()} have since completed the program. How many are still active?`,
];

// ─── Generators ─────────────────────────────────────────────────────────────

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
  const max  = difficulty === "easy" ? 1000 : difficulty === "medium" ? 5000 : 10000;
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
  const max  = difficulty === "easy" ? 1000 : difficulty === "medium" ? 5000 : 10000;
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
    case "division":       return generateDivision(difficulty);
    case "multiplication": return generateMultiplication(difficulty);
    case "addition":       return generateAddition(difficulty);
    case "subtraction":    return generateSubtraction(difficulty);
  }
}

export function generateQuestions(
  operation: Operation,
  difficulty: Difficulty,
  count: number
): Question[] {
  return Array.from({ length: count }, () => generateQuestion(operation, difficulty));
}

// Used by the Custom Scenario Builder — generates questions with user-supplied numbers
export function generateCustomQuestion(
  operation: Exclude<Operation, "mixed">,
  a: number,
  b: number,
): Question {
  switch (operation) {
    case "division":
      return {
        prompt: pick(divisionPrompts)(a, b),
        answer: Math.round(a / b),
        operation: "division",
        hint: `${a.toLocaleString()} ÷ ${b}`,
      };
    case "multiplication":
      return {
        prompt: pick(multiplicationPrompts)(a, b),
        answer: a * b,
        operation: "multiplication",
        hint: `${a} × ${b}`,
      };
    case "addition":
      return {
        prompt: pick(additionPrompts)(a, b),
        answer: a + b,
        operation: "addition",
        hint: `${a.toLocaleString()} + ${b.toLocaleString()}`,
      };
    case "subtraction":
      return {
        prompt: pick(subtractionPrompts)(a, b),
        answer: a - b,
        operation: "subtraction",
        hint: `${a.toLocaleString()} − ${b.toLocaleString()}`,
      };
  }
}

export function generateCustomQuestions(
  operation: Exclude<Operation, "mixed">,
  a: number,
  b: number,
  count: number,
): Question[] {
  return Array.from({ length: count }, () => generateCustomQuestion(operation, a, b));
}
