'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, Apple, Droplet, CalendarDays } from 'lucide-react';
import styles from './BottomNavigation.module.css';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/peso', label: 'Peso', icon: Scale },
    { path: '/alimentacao', label: 'Comida', icon: Apple },
    { path: '/agua', label: 'Água', icon: Droplet },
    { path: '/calendario', label: 'Histórico', icon: CalendarDays },
  ];

  return (
    <nav className={styles.bottomNav}>
      <div className={styles.navContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
              <div className={styles.iconContainer}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
