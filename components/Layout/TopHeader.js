'use client';
import styles from './TopHeader.module.css';
import { Settings, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopHeader() {
  const [name, setName] = useState('Campeão');

  useEffect(() => {
    const savedName = localStorage.getItem('craque_name');
    if (savedName) setName(savedName);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.profile}>
        <div className={styles.avatar}>⚽</div>
        <div className={styles.userInfo}>
          <span className={styles.greeting}>Jogador</span>
          <h1 className={styles.name}>{name}!</h1>
        </div>
      </div>
      
      <Link href="/perfil" style={{ color: 'var(--text-muted)', background: '#f8f9fa', padding: '8px', borderRadius: '50%', display: 'flex' }}>
        <Settings size={20} />
      </Link>
    </header>
  );
}
