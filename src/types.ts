export type BookStatus = 'want-to-read' | 'reading' | 'finished' | 'on-hold';

export type Book = {
  id: number;
  title: string;
  authors: string;
  thumbnail: string;
  description: string;
  review: string;
  rating?: number;
  dateAdded?: string;
  status: BookStatus;
};

export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
};