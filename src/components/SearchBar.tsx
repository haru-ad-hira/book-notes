import styles from './SearchBar.module.css';

type Props = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SearchBar = ({ searchTerm, setSearchTerm }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="登録した本を検索（著者・タイトル）"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.input}
        />
        <span className={styles.icon}>🔍</span>
      </div>
    </div>
  );
};

export default SearchBar;