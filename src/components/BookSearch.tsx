import { useState } from 'react';

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

  return (
    <div>
      <h2>Google Booksで検索</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="キーワードを入力"
      />
      <button onClick={searchBooks}>検索</button>

      {isLoading && <p>検索中...</p>}

      <ul>
        {results.map((book) => (
          <li key={book.id} style={{ marginBottom: '1rem' }}>
            <strong>{book.volumeInfo.title}</strong>
            <br />
            <small>{book.volumeInfo.authors?.join(', ')}</small>
            <br />
            {book.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                style={{ height: '100px' }}
              />
            )}
            <br />
            <button onClick={() => onSelect(book)}>この本を選ぶ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearch;
