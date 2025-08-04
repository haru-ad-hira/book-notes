import BookSearch from './BookSearch';
import StarRating from './StarRating';
import type { BookStatus } from '../types';

type Props = {
  title: string;
  setTitle: (val: string) => void;
  authors: string;
  setAuthors: (val: string) => void;
  thumbnail: string;
  setThumbnail: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  review: string;
  setReview: (val: string) => void;
  rating: number;
  setRating: (val: number) => void;
  status: BookStatus;
  setStatus: (val: BookStatus) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing?: boolean;
};

const BookForm = ({
  title,
  setTitle,
  authors,
  setAuthors,
  thumbnail,
  setThumbnail,
  description,
  setDescription,
  review,
  setReview,
  rating,
  setRating,
  status,
  setStatus,
  onSubmit,
  onCancel,
  isEditing = false
}: Props) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
        marginBottom: '2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
          }}
        >
          {isEditing ? '本を編集' : '新しい本を追加'}
        </h3>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          ×
        </button>
      </div>

      {/* BookSearch - 編集時は非表示 */}
      {!isEditing && (
        <div style={{ marginBottom: '1.5rem' }}>
          <BookSearch
            onSelect={(book) => {
              setTitle(book.volumeInfo.title);
              setAuthors(book.volumeInfo.authors?.join(', ') || '');
              setThumbnail(book.volumeInfo.imageLinks?.thumbnail || '');
              setDescription(book.volumeInfo.description || '');
            }}
          />
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* タイトル */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              タイトル *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10b981')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* 著者 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              著者
            </label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10b981')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* ステータス */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
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

          {/* 説明 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10b981')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* 表紙画像 */}
          {thumbnail && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                表紙
              </label>
              <img
                src={thumbnail}
                alt="表紙"
                style={{
                  height: '150px',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
            </div>
          )}

          {/* 評価 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              評価
            </label>
            <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
          </div>

          {/* 感想 */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem',
              }}
            >
              感想
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="この本の感想を書いてください..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#10b981')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
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
              {isEditing ? '保存' : '追加'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
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
              キャンセル
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;