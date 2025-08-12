import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <span className={styles.icon}>📚</span>
        <h1 className={styles.title}>
          あなたの本棚
        </h1>
      </div>
    </div>
  );
};

export default Header;