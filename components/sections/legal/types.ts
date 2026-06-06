export type Block =
  | { p: string }
  | { ul: string[] }
  | { table: { headers: string[]; rows: string[][] } };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type LegalContent = {
  label: string;
  title: string;
  intro: string;
  sections: Section[];
};
