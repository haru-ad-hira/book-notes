import styles from './FilterTabs.module.css';

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
    <div className={styles.container}>
      <div className={styles.tabsGrid}>
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setActiveFilter(option.key)}
            className={`${styles.tabButton} ${activeFilter === option.key ? styles.active : ''}`}
          >
            <span className={styles.icon}>{option.icon}</span>
            <span className={styles.label}>{option.label}</span>
            <span className={`${styles.count} ${activeFilter === option.key ? styles.countActive : ''}`}>
              {option.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;