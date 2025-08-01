type Props = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
};

const StarRating = ({ rating, onRatingChange, interactive = false }: Props) => {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: '20px',
            color: star <= rating ? '#fbbf24' : '#d1d5db',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.2s ease',
          }}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
          onMouseEnter={(e) => {
            if (interactive) {
              e.currentTarget.style.color = '#fbbf24';
            }
          }}
          onMouseLeave={(e) => {
            if (interactive && star > rating) {
              e.currentTarget.style.color = '#d1d5db';
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
