'use client';
import styles from './TopHeader.module.css';
import { Settings, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopHeader() {
  const [name, setName] = useState('Campeão');

  useEffect(() => {
    const savedName = localStorage.getItem('craque_name');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedName) setName(savedName);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className={styles.header}>
      <div className={styles.profile}>
        <div className={styles.avatar}>⚽</div>
        <div className={styles.userInfo}>
          <span className={styles.greeting}>{getGreeting()}</span>
          <h1 className={styles.name}>{name}!</h1>
        </div>
      </div>
      
      <Link href="/perfil" style={{ color: 'var(--text-muted)', background: '#f8f9fa', padding: '8px', borderRadius: '50%', display: 'flex' }}>
        <Settings size={20} />
      </Link>
    </header>
  );
}
