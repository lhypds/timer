import styles from './not_found.module.css';

const NotFoundView = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.inner}>
        <h1 className={styles.title}>404</h1>
      </div>
    </div>
  );
};

export default NotFoundView;
