import styles from './TopHeader.module.css';
import { Medal } from 'lucide-react';

export default function TopHeader() {
  // Dados mockados por enquanto
  const user = { name: 'Campeão', points: 150 };

  return (
    <header className={styles.header}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          ⚽
        </div>
        <div className={styles.userInfo}>
          <span className={styles.greeting}>Olá,</span>
          <h1 className={styles.name}>{user.name}!</h1>
        </div>
      </div>
      
      <div className={styles.scoreBoard}>
        <Medal className={styles.medalIcon} size={20} />
        <span className={styles.points}>{user.points} pts</span>
      </div>
    </header>
  );
}
