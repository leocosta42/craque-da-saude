'use client';
import { useState } from 'react';
import WeightChart from '../../components/Weight/WeightChart';
import MotivationalCard from '../../components/Weight/MotivationalCard';

export default function PesoPage() {
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    if (!weight) return;
    
    // Salvando localmente para calcular a meta de água
    localStorage.setItem('craque_weight', weight);
    
    // Logica de salvar no supabase virá aqui
    alert(`Golaço! Você registrou ${weight}kg pro seu treino de hoje.`);
    setWeight('');
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <MotivationalCard />

      <div className="card">
        <h2 className="title-primary">Registrar Treino ⚽</h2>
        <p className="subtitle">Seu peso de hoje para o acompanhamento da temporada.</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input 
            type="number"
            step="0.1"
            placeholder="Ex: 45.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: '12px',
              border: '2px solid var(--neutral-gray)',
              fontSize: '1.2rem',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleSave}
            style={{
              background: 'var(--grad-field)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0 1.5rem',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(46, 204, 113, 0.3)'
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Evolução do Craque</h2>
        <p className="subtitle">Veja sua consistência de treinos e crescimento.</p>
        <WeightChart />
      </div>
    </div>
  );
}
