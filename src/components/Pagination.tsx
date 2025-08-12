// Pagination.tsx
import styles from './Pagination.module.css';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
};

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: Props) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className={styles.container}>
      {/* アイテム数表示 */}
      <div className={styles.itemCount}>
        {totalItems}件中 {startItem}-{endItem}件を表示
      </div>

      {/* ページネーションボタン */}
      <div className={styles.buttonContainer}>
        {/* 最初のページボタン */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${styles.button} ${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        >
          最初
        </button>

        {/* 前のページボタン */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.button} ${styles.navButton} ${currentPage === 1 ? styles.disabled : ''}`}
        >
          <span className={styles.arrow}>◀</span> 前
        </button>

        {/* ページ番号ボタン */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`${styles.button} ${styles.pageButton} ${pageNum === currentPage ? styles.active : ''}`}
          >
            {pageNum}
          </button>
        ))}

        {/* 次のページボタン */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.button} ${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        >
          次 <span className={styles.arrow}>▶</span>
        </button>

        {/* 最後のページボタン */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${styles.button} ${styles.navButton} ${currentPage === totalPages ? styles.disabled : ''}`}
        >
          最後
        </button>
      </div>

      {/* ページ情報 */}
      <div className={styles.pageInfo}>
        ページ {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default Pagination;