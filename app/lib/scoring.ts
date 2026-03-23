import { TOOLS, Tool, TOOL_COLORS } from "../data/tools";
import { SUBJECT_MAP, SUBJECTS } from "../data/subjects";

export interface ScoredTool {
  id: string;
  score: number;
  tool: Tool;
  color: string;
}

export interface Answers {
  grade: string;
  subject: string;
  ecosystem: string;
  need: string;
  budget: string;
}

export function scoreTools(answers: Answers): ScoredTool[] {
  const { grade, subject, ecosystem, budget, need } = answers;
  const sjG = SUBJECT_MAP[subject] || subject;

  const scored = Object.entries(TOOLS).map(([id, t]) => {
    let s = 0;

    if (t.g.includes(grade)) s += 2;
    if (t.sj.includes(sjG)) s += 5;
    if (t.sj.includes(subject)) s += 3;
    if (t.sj.includes("general")) s += 1;
    if (t.nd.includes(need)) s += 6;
    if (t.b.includes(budget)) s += 2;
    if (budget === "free" && t.pt === "f") s += 4;
    if (budget === "free" && t.pt === "fm") s += 2;
    if (budget === "free" && t.pt === "p") s -= 12;
    if (t.ec.includes(ecosystem)) s += 2;
    if (ecosystem !== "mixed" && !t.ec.includes(ecosystem)) s -= 4;
    if (t.eb && t.eb[ecosystem]) s += t.eb[ecosystem];

    return { id, score: s, tool: t, color: TOOL_COLORS[id] || "#8b5cf6" };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter((t) => t.score > 4).slice(0, 8);
}

export function getSubjectName(subjectId: string, grade: string): string {
  const subjects = SUBJECTS[grade] || SUBJECTS.all;
  const found = subjects.find((s) => s.id === subjectId);
  return found?.t || subjectId;
}
