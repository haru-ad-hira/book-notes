import { useState } from 'react';
import styles from './BookSearch.module.css';

type GoogleBook = {
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

type Props = {
  onSelect: (book: GoogleBook) => void;
};

const BookSearch = ({ onSelect }: Props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.items || []);
    } catch (err) {
      console.error('検索に失敗しました', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Google Booksで検索</label>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="書籍名や著者名を入力"
          className={styles.input}
        />
        <button
          onClick={searchBooks}
          disabled={!query.trim() || isLoading}
          className={`${styles.button} ${(!query.trim() || isLoading) ? styles.buttonDisabled : ''}`}
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>

      {results.length > 0 && (
        <div className={styles.resultsContainer}>
          {results.map((book) => (
            <div
              key={book.id}
              className={styles.resultItem}
              onClick={() => onSelect(book)}
            >
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className={styles.thumbnail}
                />
              )}
              <div className={styles.bookInfo}>
                <h4 className={styles.title}>{book.volumeInfo.title}</h4>
                <p className={styles.authors}>
                  {book.volumeInfo.authors?.join(', ') || '著者不明'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSearch;