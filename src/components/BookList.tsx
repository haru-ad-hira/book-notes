import { useState, useEffect } from 'react';
import type { Book } from '../types';
import BookItem from './BookItem';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 10;

type Props = {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onSave: (book: Book) => void;
};

const BookList = ({ books, onEdit, onDelete, onSave }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 本のリストが変更されたときにページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

  if (books.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
        <p style={{ fontSize: '1.125rem', margin: 0 }}>本が登録されていません</p>
      </div>
    );
  }

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBooks = books.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // ページ変更時に画面をトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* 現在のページ情報を表示 */}
      {totalPages > 1 && (
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span>📄</span>
            <span>ページ {currentPage} / {totalPages}</span>
            <span>•</span>
            <span>全{books.length}件中 {startIndex + 1}-{Math.min(endIndex, books.length)}件を表示</span>
          </div>
        </div>
      )}

      {/* 本のリスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {currentBooks.map((book) => (
          <BookItem 
            key={book.id} 
            book={book} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onSave={onSave}
          />
        ))}
      </div>

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={books.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
};

export default BookList;