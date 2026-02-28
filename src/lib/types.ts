export interface Note {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

export type NewNote = Omit<Note, 'id' | 'created_at'>;
