export type RandomQuote = {
  author: string;
  text: string;
};

export type RandomQuotes = RandomQuote[];

export type JournalType = {
  ID: string;
  attachment?: string;
  created_at: string;
  description: string;
  description_style?: string;
  overall_mood: string;
  title: string;
  type: string;
  updated_at: string;
  user_id: string;
};

export type AllJournalType = {
  journals?: JournalType[];
  error?: string;
};
