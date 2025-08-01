import BookSearch from './BookSearch';
import StarRating from './StarRating';

import { useState } from 'react';

export type BookStatus = 'want-to-read' | 'reading' | 'finished' | 'on-hold';

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
  onCancel
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
          新しい本を追加
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

      {/* BookSearch */}
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

      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* 各入力項目（タイトル、著者、ステータスなど） */}
          <label>タイトル</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>著者</label>
          <input value={authors} onChange={(e) => setAuthors(e.target.value)} />

          <label>ステータス</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}>
            <option value="want-to-read">読みたい</option>
            <option value="reading">今読んでいる</option>
            <option value="finished">読み終わった</option>
            <option value="on-hold">積読</option>
          </select>

          <label>説明</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          {thumbnail && (
            <div>
              <label>表紙</label>
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

          <label>評価</label>
          <StarRating rating={rating} onRatingChange={setRating} interactive={true} />

          <label>感想</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} />

          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
            <button type="submit">追加</button>
            <button type="button" onClick={onCancel}>
              キャンセル
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
