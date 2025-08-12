import { useState } from 'react';
import StarRating from './StarRating';
import type { Book, BookStatus } from '../types';
import styles from './BookItem.module.css';

type Props = {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onSave: (book: Book) => void;
};

const statusStyles: Record<BookStatus, { label: string; color: string; bg: string }> = {
  'want-to-read': { label: '読みたい', color: '#3b82f6', bg: '#dbeafe' },
  reading: { label: '今読んでいる', color: '#f59e0b', bg: '#fef3c7' },
  finished: { label: '読み終わった', color: '#10b981', bg: '#dcfce7' },
  'on-hold': { label: '積読', color: '#6b7280', bg: '#f3f4f6' },
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

  // book.status が有効かチェックし、デフォルト値を設定
  const currentStatus = book.status && statusStyles[book.status] ? book.status : 'want-to-read';
  const statusStyle = statusStyles[currentStatus];

  if (isEditing) {
    return (
      <div className={`${styles.container} ${styles.editContainer}`}>
        <div className={styles.inner}>
          <div>
            {editData.thumbnail ? (
              <img src={editData.thumbnail} alt={editData.title} className={styles.thumbnail} />
            ) : (
              <div className={styles.noImage}>📚</div>
            )}
          </div>
          <div className={styles.content}>
            <h3 className={styles.title} style={{ color: '#10b981', fontSize: '1.25rem' }}>📝 編集中</h3>
            <div className={styles.inputGroup}>
              <div>
                <label className={styles.label}>タイトル</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>著者</label>
                <input
                  type="text"
                  value={editData.authors}
                  onChange={(e) => handleInputChange('authors', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div>
                <label className={styles.label}>ステータス</label>
                <select
                  value={editData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as BookStatus)}
                  className={styles.select}
                >
                  <option value="want-to-read">読みたい</option>
                  <option value="reading">今読んでいる</option>
                  <option value="finished">読み終わった</option>
                  <option value="on-hold">積読</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>評価</label>
                <StarRating
                  rating={editData.rating || 0}
                  onRatingChange={(rating) => handleInputChange('rating', rating)}
                  interactive={true}
                />
              </div>
              <div>
                <label className={styles.label}>感想</label>
                <textarea
                  value={editData.review}
                  onChange={(e) => handleInputChange('review', e.target.value)}
                  rows={3}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.actions}>
                <button onClick={handleSave} className={`${styles.button} ${styles.buttonSave}`}>💾 保存</button>
                <button onClick={handleCancel} className={`${styles.button} ${styles.buttonCancel}`}>❌ キャンセル</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div>
          {book.thumbnail ? (
            <img src={book.thumbnail} alt={book.title} className={styles.thumbnail} />
          ) : (
            <div className={styles.noImage}>📚</div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{book.title}</h3>
          <div
            className={styles.statusLabel}
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {statusStyle.label}
          </div>
          <p className={styles.authors}>{book.authors}</p>
          {book.dateAdded && <p className={styles.date}>📅 {book.dateAdded}</p>}
          <StarRating rating={book.rating || 0} />
          {book.review && (
            <div className={styles.reviewBox}>
              <strong>✍️ 感想</strong>
              <p className={styles.reviewText}>{book.review}</p>
            </div>
          )}
          <div className={styles.actions}>
            <button onClick={handleEdit} className={`${styles.button} ${styles.buttonEdit}`}>✏️ 編集</button>
            <button onClick={() => onDelete(book.id)} className={`${styles.button} ${styles.buttonDelete}`}>🗑️ 削除</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;