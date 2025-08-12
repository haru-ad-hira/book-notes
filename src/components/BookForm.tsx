import BookSearch from './BookSearch';
import StarRating from './StarRating';
import type { BookStatus } from '../types';
import styles from './BookForm.module.css';

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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {isEditing ? '本を編集' : '新しい本を追加'}
        </h3>
        <button onClick={onCancel} className={styles.closeButton}>
          ×
        </button>
      </div>

      {/* BookSearch - 編集時は非表示 */}
      {!isEditing && (
        <div className={styles.searchSection}>
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

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* タイトル */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>タイトル *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {/* 著者 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>著者</label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* ステータス */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>ステータス</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
              className={styles.select}
            >
              <option value="want-to-read">読みたい</option>
              <option value="reading">今読んでいる</option>
              <option value="finished">読み終わった</option>
              <option value="on-hold">積読</option>
            </select>
          </div>

          {/* 説明 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>説明</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={styles.textarea}
            />
          </div>

          {/* 表紙画像 */}
          {thumbnail && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>表紙</label>
              <img
                src={thumbnail}
                alt="表紙"
                className={styles.thumbnail}
              />
            </div>
          )}

          {/* 評価 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>評価</label>
            <StarRating rating={rating} onRatingChange={setRating} interactive={true} />
          </div>

          {/* 感想 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>感想</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              placeholder="この本の感想を書いてください..."
              className={styles.textarea}
            />
          </div>

          {/* ボタン */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              {isEditing ? '保存' : '追加'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`${styles.button} ${styles.cancelButton}`}
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