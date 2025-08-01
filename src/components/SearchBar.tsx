type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SearchBar = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="登録した本を検索（著者・タイトル）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#10b981';
            e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '1.25rem',
          }}
        >
          🔍
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
