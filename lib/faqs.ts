export const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;
export type FaqKey = (typeof faqKeys)[number];
