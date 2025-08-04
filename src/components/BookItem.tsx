import { useState } from 'react';
import StarRating from './StarRating';
import type { Book, BookStatus } from '../types';

type Props = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onSave: (book: Book) => void;
};

const getStatusLabel = (status: BookStatus) => {
  const statusMap = {
    'want-to-read': '読みたい',
    reading: '今読んでいる',
    finished: '読み終わった',
    'on-hold': '積読',
  };
  return statusMap[status];
};

const getStatusColor = (status: BookStatus) => {
  const colorMap = {
    'want-to-read': '#3b82f6',
    reading: '#f59e0b',
    finished: '#10b981',
    'on-hold': '#6b7280',
  };
  return colorMap[status];
};

const getStatusBgColor = (status: BookStatus) => {
  const bgColorMap = {
    'want-to-read': '#dbeafe',
    reading: '#fef3c7',
    finished: '#dcfce7',
    'on-hold': '#f3f4f6',
  };
  return bgColorMap[status];
};

const BookItem = ({ book, onEdit, onDelete, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Book>(book);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(book);
  };

  const handleSave = () => {
    onSave(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(book);
  };

  const handleInputChange = (field: keyof Book, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #10b981',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flexShrink: 0 }}>
            {editData.thumbnail ? (
              <img
                src={editData.thumbnail}
                alt={editData.title}
                style={{
                  width: '96px',
                  height: '128px',
                  objectFit: 'cover',
                  borderRadius: '0.5rem',
                }}
              />
            ) : (
              <div
                style={{
                  width: '96px',
                  height: '128px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}
              >
                📚
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                margin: '0 0 0.5rem 0', 
                fontWeight: 'bold',
                color: '#10b981',
                fontSize: '1.25rem'
              }}>
                📝 編集中
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {/* タイトル */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  タイトル
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* 著者 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  著者
                </label>
                <input
                  type="text"
                  value={editData.authors}
                  onChange={(e) => handleInputChange('authors', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* ステータス */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  ステータス
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as BookStatus)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                >
                  <option value="want-to-read">読みたい</option>
                  <option value="reading">今読んでいる</option>
                  <option value="finished">読み終わった</option>
                  <option value="on-hold">積読</option>
                </select>
              </div>

              {/* 評価 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  評価
                </label>
                <StarRating 
                  rating={editData.rating || 0} 
                  onRatingChange={(rating) => handleInputChange('rating', rating)}
                  interactive={true}
                />
              </div>

              {/* 感想 */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  感想
                </label>
                <textarea
                  value={editData.review}
                  onChange={(e) => handleInputChange('review', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#10b981')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>

              {/* ボタン */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                >
                  💾 保存
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  ❌ キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 通常表示モード
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        padding: '1.5rem',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
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
              }}
            />
          ) : (
            <div
              style={{
                width: '96px',
                height: '128px',
                backgroundColor: '#dcfce7',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              📚
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>{book.title}</h3>
          <div
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              backgroundColor: getStatusBgColor(book.status),
              color: getStatusColor(book.status),
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            {getStatusLabel(book.status)}
          </div>

          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>{book.authors}</p>

          {book.dateAdded && (
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#9ca3af', 
              margin: '0 0 0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              📅 {book.dateAdded}
            </p>
          )}

          <StarRating rating={book.rating || 0} />

          {book.review && (
            <div
              style={{
                backgroundColor: '#f0f9ff',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                color: '#0c4a6e',
                marginTop: '0.75rem',
              }}
            >
              <strong>✍️ 感想</strong>
              <p style={{ margin: '0.5rem 0 0 0', lineHeight: '1.5' }}>{book.review}</p>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleEdit}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }}
            >
              ✏️ 編集
            </button>
            <button 
              onClick={() => onDelete(book.id)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
              }}
            >
              🗑️ 削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;