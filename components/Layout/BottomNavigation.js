'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scale, Apple, Droplet, CalendarDays, Dumbbell } from 'lucide-react';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Início', icon: Home, exact: true },
    { path: '/peso', label: 'Peso', icon: Scale },
    { path: '/alimentacao', label: 'Comida', icon: Apple },
    { path: '/agua', label: 'Água', icon: Droplet },
    { path: '/esportes', label: 'Treino', icon: Dumbbell },
    { path: '/calendario', label: 'Agenda', icon: CalendarDays },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <div className={styles.iconContainer}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
