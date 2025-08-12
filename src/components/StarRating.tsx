import styles from './StarRating.module.css';

type Props = {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
};

const StarRating = ({ rating, onRatingChange, interactive = false }: Props) => {
  return (
    <div className={`${styles.container} ${interactive ? styles.interactive : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= rating ? styles.filled : styles.empty} ${interactive ? styles.clickable : ''}`}
          onClick={() => interactive && onRatingChange && onRatingChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;