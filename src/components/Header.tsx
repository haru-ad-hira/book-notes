const Header = () => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <span style={{ fontSize: '2.5rem', marginRight: '0.75rem' }}>📚</span>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
          }}
        >
          あなたの本棚
        </h1>
      </div>
    </div>
  );
};

export default Header;
