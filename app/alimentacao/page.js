'use client';
import { Apple, Pizza } from 'lucide-react';
import { useState } from 'react';

export default function AlimentacaoPage() {
  const [stickers, setStickers] = useState(3);

  const logMeal = (type) => {
    if (type === 'healthy') {
      setStickers(s => s + 1);
      alert('Boa, campeão! Combustível premium adicionado. 🌟 Ganhou uma figurinha!');
    } else {
      alert('Todo jogador precisa de um descanso, mas lembre do foco! ⚽');
    }
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h2 className="title-primary">Registro de Combustível 🥗</h2>
        <p className="subtitle">O que você mandou pra dentro hoje?</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            onClick={() => logMeal('healthy')}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(46, 204, 113, 0.1)',
              border: '2px solid var(--field-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--field-green-dark)',
              fontWeight: 700
            }}
          >
            <Apple size={32} />
            <span>Combustível Premium</span>
          </button>
          
          <button 
            onClick={() => logMeal('unhealthy')}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(231, 76, 60, 0.1)',
              border: '2px solid rgba(231, 76, 60, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#c0392b',
              fontWeight: 700
            }}
          >
            <Pizza size={32} />
            <span>Alimento de Desgaste</span>
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Álbum de Figurinhas 📙</h2>
        <p className="subtitle">Colecione heróis da saúde! Você tem {stickers} figurinhas.</p>
        
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              minWidth: '80px',
              height: '110px',
              borderRadius: '8px',
              background: i < stickers ? 'var(--grad-field)' : '#ecf0f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: i < stickers ? 'white' : '#bdc3c7',
              fontWeight: 'bold',
              boxShadow: i < stickers ? 'var(--shadow-sm)' : 'none',
              border: i < stickers ? 'none' : '2px dashed #bdc3c7'
            }}>
              {i < stickers ? '✨' : '?'}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
