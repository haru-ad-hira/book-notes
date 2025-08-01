type FilterKey = 'all' | 'with-review' | 'want-to-read' | 'reading' | 'finished' | 'on-hold';

type FilterOption = {
  key: FilterKey;
  label: string;
  icon: string;
  count: number;
};

type Props = {
  activeFilter: FilterKey;
  setActiveFilter: (key: FilterKey) => void;
  filterOptions: FilterOption[];
};

const FilterTabs = ({ activeFilter, setActiveFilter, filterOptions }: Props) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.5rem',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #f3f4f6',
      }}
    >
      {filterOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => setActiveFilter(option.key)}
          style={{
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: activeFilter === option.key ? '#10b981' : 'transparent',
            color: activeFilter === option.key ? 'white' : '#374151',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== option.key) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== option.key) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{option.icon}</span>
          <span>{option.label}</span>
          <span
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: activeFilter === option.key ? 'white' : '#10b981',
            }}
          >
            {option.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
