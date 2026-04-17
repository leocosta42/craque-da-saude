import { Trophy } from 'lucide-react';

export default function MotivationalCard() {
  return (
    <div style={{
      background: 'var(--grad-field)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Círculo decorativo */}
      <div style={{
        position: 'absolute',
        right: '-20px',
        top: '-40px',
        width: '120px',
        height: '120px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%'
      }} />
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.2)',
        padding: '0.8rem',
        borderRadius: 'var(--radius-full)'
      }}>
        <Trophy size={32} color="white" />
      </div>
      
      <div style={{ zIndex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Belo Passe!</h3>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Você está mandando muito bem na temporada. Mantenha o ritmo!</p>
      </div>
    </div>
  );
}
