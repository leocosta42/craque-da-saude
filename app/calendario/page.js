'use client';
import { CalendarDays, Flame } from 'lucide-react';

export default function CalendarioPage() {
  const mockDays = [
    { day: 1, status: 'green' }, // Loss
    { day: 2, status: 'green' }, // Loss
    { day: 3, status: 'orange' }, // Gain (Laranja, conforme acordado)
    { day: 4, status: 'gray' }, // No log
    { day: 5, status: 'green' }, 
    { day: 6, status: 'green' },
    { day: 7, status: 'green' },
  ];

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div style={{
        background: 'linear-gradient(135deg, #ff7675, #d63031)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 8px 15px rgba(214, 48, 49, 0.3)'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.8rem', borderRadius: '50%' }}>
          <Flame size={32} color="white" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>3 Dias de Fogo!</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Você logou saúde 3 dias seguidos.</p>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Seu Calendário 📅</h2>
        <p className="subtitle">Histórico de vitórias na temporada atual.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
            <div key={i} style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{d}</div>
          ))}
          
          {mockDays.map((d, i) => {
            let bg = '#ecf0f1';
            let color = '#7f8c8d';
            
            if (d.status === 'green') {
              bg = 'rgba(46, 204, 113, 0.2)';
              color = 'var(--field-green-dark)';
            } else if (d.status === 'orange') {
              bg = 'rgba(243, 156, 18, 0.2)';
              color = '#d35400';
            }

            return (
              <div key={i} style={{
                aspectRatio: '1',
                borderRadius: '50%',
                background: bg,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: d.status === 'gray' ? '2px dashed #bdc3c7' : 'none'
              }}>
                {d.day}
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'var(--field-green)' }} /> Treino Concluído (Manutenção/Perda)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: 'var(--weight-gain-orange)' }} /> Ganho (Fase de Crescimento)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#bdc3c7', border: '1px dashed #95a5a6' }} /> Dia de Descanso (Sem registro)
          </div>
        </div>

      </div>

    </div>
  );
}
