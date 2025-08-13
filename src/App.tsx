import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import BookForm from './components/BookForm';
import StarRating from './components/StarRating';
import BookList from './components/BookList';

type BookStatus = 'want-to-read' | 'reading' | 'finished' | 'on-hold';

type Book = {
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

// BookSearchコンポーネント
const BookSearch = ({ onSelect }: { onSelect: (book: GoogleBook) => void }) => {
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
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
      }}>Google Booksで検索</label>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="書籍名や著者名を入力"
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#10b981'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={searchBooks}
          disabled={!query.trim() || isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
            opacity: query.trim() && !isLoading ? 1 : 0.6,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (query.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = '#059669';
            }
          }}
          onMouseLeave={(e) => {
            if (query.trim() && !isLoading) {
              e.currentTarget.style.backgroundColor = '#10b981';
            }
          }}
        >
          {isLoading ? '検索中...' : '検索'}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          backgroundColor: '#f9fafb'
        }}>
          {results.map((book) => (
            <div
              key={book.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => onSelect(book)}
            >
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  style={{
                    width: '60px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '0.25rem',
                    flexShrink: 0
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{book.volumeInfo.title}</h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{book.volumeInfo.authors?.join(', ') || '著者不明'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const loadBooks = (): Book[] => {
    const stored = localStorage.getItem('books');
    return stored ? JSON.parse(stored) : [];
  };

  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [authors, setAuthors] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<BookStatus>('want-to-read');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'with-review' | BookStatus>('all');
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleBookSave = (updatedBook: Book) => {
    setBooks(books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    ));
  };

  const resetForm = () => {
    setTitle('');
    setAuthors('');
    setThumbnail('');
    setDescription('');
    setReview('');
    setRating(0);
    setStatus('want-to-read');
    setEditingBookId(null);
    setShowAddForm(false);
  };

  const deleteBook = (bookId: number) => {
    if (confirm('この本を削除しますか？')) {
      setBooks(books.filter(book => book.id !== bookId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (editingBookId !== null) {
      // 編集モード：既存の本を更新
      setBooks(books.map(book => 
        book.id === editingBookId 
          ? {
              ...book,
              title,
              authors,
              thumbnail,
              description,
              review,
              rating,
              status,
            }
          : book
      ));
    } else {
      // 新規追加モード：新しい本を追加
      const newBook: Book = {
        id: Date.now(),
        title,
        authors,
        thumbnail,
        description,
        review,
        rating,
        status,
        dateAdded: new Date().toLocaleDateString('ja-JP'),
      };
      setBooks([newBook, ...books]);
    }

    resetForm();
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    interactive = false 
  }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void; 
    interactive?: boolean;
  }) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: '20px',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              cursor: interactive ? 'pointer' : 'default',
              transition: 'color 0.2s ease'
            }}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            onMouseEnter={(e) => {
              if (interactive) {
                e.currentTarget.style.color = '#fbbf24';
              }
            }}
            onMouseLeave={(e) => {
              if (interactive && star > rating) {
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getStatusLabel = (status: BookStatus) => {
    const statusMap = {
      'want-to-read': '読みたい',
      'reading': '今読んでいる',
      'finished': '読み終わった',
      'on-hold': '積読'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: BookStatus) => {
    const colorMap = {
      'want-to-read': '#3b82f6',
      'reading': '#f59e0b',
      'finished': '#10b981',
      'on-hold': '#6b7280'
    };
    return colorMap[status];
  };

  const getStatusBgColor = (status: BookStatus) => {
    const bgColorMap = {
      'want-to-read': '#dbeafe',
      'reading': '#fef3c7',
      'finished': '#dcfce7',
      'on-hold': '#f3f4f6'
    };
    return bgColorMap[status];
  };

  const filteredBooks = books.filter(book => {
    // book オブジェクトの安全性チェック
    if (!book || typeof book !== 'object') return false;

    const matchesSearch = (book.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.authors || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'with-review') return matchesSearch && book.review && book.review.trim() !== '';

    // 各ステータスは純粋にステータスのみで判定
    return matchesSearch && book.status === activeFilter;
  });

  const getFilterCounts = () => {
    return {
      all: books.length,
      'with-review': books.filter(book => book.review && book.review.trim() !== '').length,
      'want-to-read': books.filter(book => book.status === 'want-to-read').length,
      'reading': books.filter(book => book.status === 'reading').length,
      'finished': books.filter(book => book.status === 'finished').length,
      'on-hold': books.filter(book => book.status === 'on-hold').length,
    };
  };

  const counts = getFilterCounts();

  const filterOptions = [
    { key: 'all', label: 'すべて', icon: '📚', count: counts.all },
    { key: 'with-review', label: '感想を書いた', icon: '✍️', count: counts['with-review'] },
    { key: 'want-to-read', label: '読みたい', icon: '💭', count: counts['want-to-read'] },
    { key: 'reading', label: '今読んでいる', icon: '📖', count: counts.reading },
    { key: 'finished', label: '読み終わった', icon: '✅', count: counts.finished },
    { key: 'on-hold', label: '積読', icon: '📚', count: counts['on-hold'] },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dffcee 0%, #ffe3e3 50%, #cce2ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Header */}
        <Header />

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Add Button */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              textAlign: 'center',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>+</span>
            新しい本を追加
          </button>
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filterOptions={filterOptions}
        />

        {/* Add Book Form */}
        {showAddForm && (
          <BookForm
            title={title}
            setTitle={setTitle}
            authors={authors}
            setAuthors={setAuthors}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            description={description}
            setDescription={setDescription}
            review={review}
            setReview={setReview}
            rating={rating}
            setRating={setRating}
            status={status}
            setStatus={setStatus}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={editingBookId !== null}
          />
        )}

        <BookList
          books={filteredBooks}
          onEdit={() => {}} // 使用しなくなったが、互換性のため残す
          onDelete={deleteBook}
          onSave={handleBookSave}
        />
      </div>
    </div>
  );
}

export default App;