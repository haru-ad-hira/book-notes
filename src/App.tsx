import { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterTabs from './components/FilterTabs';
import BookForm from './components/BookForm';
import StarRating from './components/StarRating';


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
  const [editForm, setEditForm] = useState<Partial<Book>>({});

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const startEditing = (book: Book) => {
    setEditingBookId(book.id);
    setEditForm({
      title: book.title,
      authors: book.authors,
      description: book.description,
      review: book.review,
      rating: book.rating,
      status: book.status
    });
  };

  const cancelEditing = () => {
    setEditingBookId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingBookId === null) return;
    
    setBooks(books.map(book => 
      book.id === editingBookId 
        ? { ...book, ...editForm }
        : book
    ));
    setEditingBookId(null);
    setEditForm({});
  };

  const deleteBook = (bookId: number) => {
    if (confirm('この本を削除しますか？')) {
      setBooks(books.filter(book => book.id !== bookId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

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
    setTitle('');
    setReview('');
    setAuthors('');
    setThumbnail('');
    setDescription('');
    setRating(0);
    setStatus('want-to-read');
    setShowAddForm(false);
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
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.authors.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'with-review') return matchesSearch && book.review.trim() !== '';
    if (activeFilter === 'finished') {
      // 「読み終わった」には、ステータスが'finished'の本 または 感想を書いた本
      return matchesSearch && (book.status === 'finished' || book.review.trim() !== '');
    }
    return matchesSearch && book.status === activeFilter;
  });

  const getFilterCounts = () => {
    return {
      all: books.length,
      'with-review': books.filter(book => book.review.trim() !== '').length,
      'want-to-read': books.filter(book => book.status === 'want-to-read').length,
      'reading': books.filter(book => book.status === 'reading').length,
      'finished': books.filter(book => book.status === 'finished' || book.review.trim() !== '').length, // ステータスが'finished' または 感想あり
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
            本を追加
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
            onCancel={() => setShowAddForm(false)}
          />
        )}


        {/* Books List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6',
                  padding: '1.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (editingBookId !== book.id) {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#dcfce7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (editingBookId !== book.id) {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = '#f3f4f6';
                  }
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flexShrink: 0 }}>
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        style={{
                          width: '96px',
                          height: '128px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '96px',
                        height: '128px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>📚</div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editingBookId === book.id ? (
                      // 編集モード
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#111827',
                            margin: 0
                          }}>本の情報を編集</h4>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={saveEdit}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEditing}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>タイトル</label>
                            <input
                              type="text"
                              value={editForm.title || ''}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#10b981'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>著者</label>
                            <input
                              type="text"
                              value={editForm.authors || ''}
                              onChange={(e) => setEditForm({...editForm, authors: e.target.value})}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#10b981'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>ステータス</label>
                            <select
                              value={editForm.status || 'want-to-read'}
                              onChange={(e) => setEditForm({...editForm, status: e.target.value as BookStatus})}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                backgroundColor: 'white',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#10b981'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            >
                              <option value="want-to-read">読みたい</option>
                              <option value="reading">今読んでいる</option>
                              <option value="finished">読み終わった</option>
                              <option value="on-hold">積読</option>
                            </select>
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>評価</label>
                            <StarRating
                              rating={editForm.rating || 0}
                              onRatingChange={(rating) => setEditForm({...editForm, rating})}
                              interactive={true}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>説明</label>
                            <textarea
                              value={editForm.description || ''}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                              rows={3}
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                resize: 'vertical',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#10b981'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>

                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#374151',
                              marginBottom: '0.25rem'
                            }}>感想</label>
                            <textarea
                              value={editForm.review || ''}
                              onChange={(e) => setEditForm({...editForm, review: e.target.value})}
                              rows={3}
                              placeholder="本の感想を入力してください（任意）"
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                outline: 'none',
                                resize: 'vertical',
                                transition: 'border-color 0.2s ease'
                              }}
                              onFocus={(e) => e.target.style.borderColor = '#10b981'}
                              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 表示モード
                      <>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{ flex: 1, minWidth: 0, marginRight: '1rem' }}>
                            <h3 style={{
                              fontSize: '1.25rem',
                              fontWeight: 'bold',
                              color: '#111827',
                              margin: '0 0 0.5rem 0',
                              lineHeight: '1.3'
                            }}>{book.title}</h3>
                            
                            <div style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.75rem',
                              backgroundColor: getStatusBgColor(book.status),
                              color: getStatusColor(book.status),
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              marginBottom: '0.5rem'
                            }}>
                              {getStatusLabel(book.status)}
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <StarRating rating={book.rating || 0} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => startEditing(book)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  border: 'none',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease',
                                  whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title="編集"
                              >
                                編集
                              </button>
                              <button
                                onClick={() => deleteBook(book.id)}
                                style={{
                                  padding: '0.5rem 0.75rem',
                                  backgroundColor: '#fef2f2',
                                  color: '#dc2626',
                                  border: 'none',
                                  borderRadius: '0.5rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease',
                                  whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#fee2e2';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#fef2f2';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                                title="削除"
                              >
                                削除
                              </button>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          marginBottom: '0.75rem'
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>👤</span>
                          <span style={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{book.authors}</span>
                        </div>

                        {book.description && (
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            marginBottom: '0.75rem',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>{book.description}</p>
                        )}

                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
                            <span style={{ marginRight: '0.5rem' }}>📅</span>
                            <span>追加日: {book.dateAdded || '日付なし'}</span>
                          </div>
                          
                          {book.review && (
                            <div style={{
                              backgroundColor: '#f0f9ff',
                              padding: '0.75rem',
                              borderRadius: '0.5rem',
                              color: '#0c4a6e',
                              lineHeight: '1.5',
                              border: '1px solid #e0f2fe'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '0.5rem'
                              }}>
                                <span style={{ marginRight: '0.5rem' }}>✍️</span>
                                <span style={{ fontWeight: '600' }}>感想</span>
                              </div>
                              {book.review}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>📚</div>
              <p style={{
                fontSize: '1.125rem',
                margin: 0
              }}>
                {searchTerm ? '検索結果が見つかりませんでした' : activeFilter === 'all' ? 'まだ本が追加されていません' : `${filterOptions.find(opt => opt.key === activeFilter)?.label}の本がありません`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;