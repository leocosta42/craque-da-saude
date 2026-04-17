'use client';
import { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';

export default function AguaPage() {
  const [waterMl, setWaterMl] = useState(0); 
  const [goalMl, setGoalMl] = useState(2000); 
  
  useEffect(() => {
    // Busca o peso informado na aba "Meu Peso", caso contrário usa 45kg como base provisória.
    const currentWeight = parseFloat(localStorage.getItem('craque_weight')) || 45;
    
    // Cálculo pediátrico de hidratação (Base inspirada em Holliday-Segar)
    // Para peso > 20kg: 1500ml + 20ml por cada kg acima de 20kg.
    let calcGoal = 2000;
    if (currentWeight > 20) {
      calcGoal = 1500 + ((currentWeight - 20) * 20);
    } else {
      calcGoal = currentWeight * 50; 
    }
    
    // Arredonda para ficar um número "cheio" mais lúdico (ex: 2100, 2500)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGoalMl(Math.round(calcGoal / 100) * 100);
  }, []);

  const percentage = Math.min(100, Math.round((waterMl / goalMl) * 100));

  const addWater = (amount) => {
    setWaterMl(prev => prev + amount);
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div className="card" style={{ textAlign: 'center' }}>
        <h2 className="title-primary">Hidratação do Campo 💧</h2>
        <p className="subtitle">Mantenha seu gramado verde para o jogo!</p>

        <div style={{
          width: '100%',
          height: '200px',
          background: '#e0cc9f', // cor de terra/gramado seco
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)'
        }}>
          {/* A grama verde subindo de acordo com a porcentagem */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${percentage}%`,
            background: 'var(--grad-field)',
            transition: 'height 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }} />

          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.9)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {percentage}% Irrigado
          </div>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0' }}>{waterMl} ml / <span style={{ color: 'var(--text-muted)' }}>{goalMl} ml</span></h3>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button 
            onClick={() => addWater(250)}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--water-blue)',
              color: 'white',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
            }}
          >
            <Droplets size={20} />
            + 250ml
          </button>
        </div>
      </div>

    </div>
  );
}
