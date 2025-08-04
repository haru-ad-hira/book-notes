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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem 0',
      borderTop: '1px solid #e5e7eb',
      marginTop: '2rem'
    }}>
      {/* アイテム数表示 */}
      <div style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        {totalItems}件中 {startItem}-{endItem}件を表示
      </div>

      {/* ページネーションボタン */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* 最初のページボタン */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          最初
        </button>

        {/* 前のページボタン */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            opacity: currentPage === 1 ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          ◀ 前
        </button>

        {/* ページ番号ボタン */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              backgroundColor: pageNum === currentPage ? '#10b981' : 'white',
              color: pageNum === currentPage ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: pageNum === currentPage ? '600' : '400',
              minWidth: '2.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (pageNum !== currentPage) {
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            {pageNum}
          </button>
        ))}

        {/* 次のページボタン */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          次 ▶
        </button>

        {/* 最後のページボタン */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: 'white',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            opacity: currentPage === totalPages ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          最後
        </button>
      </div>

      {/* ページ情報 */}
      <div style={{
        fontSize: '0.75rem',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        ページ {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default Pagination;