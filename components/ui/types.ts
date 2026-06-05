export type View = "dashboard" | "interview" | "history" | "cv-review" | "cv-builder" | "cover-letter" | "job-tracker";

export interface Interview {
  id: string;
  title: string;
  field: string;
  level: "junior" | "mid" | "senior" | "lead";
  type: "technical" | "behavioral" | "mixed" | "system-design";
  date: string;
  score?: number;
  duration: string;
  status: "ready" | "completed" | "in-progress";
  questionCount: number;
}