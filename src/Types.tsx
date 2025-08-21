export
  interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export type CurrentView = 'list' | 'add' | 'detail';