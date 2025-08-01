export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  status: 'available' | 'borrowed';
  borrowedBy?: string;
  borrowedDate?: string;
  dueDate?: string;
}