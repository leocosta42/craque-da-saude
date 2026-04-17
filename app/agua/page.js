'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Droplets, Waves, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function AguaPage() {
  const [waterMl, setWaterMl] = useState(0); 
  const [goalMl, setGoalMl] = useState(2000); 
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  async function initData() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Pega logs de hoje
    const { data } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', USER_ID)
      .gte('recorded_at', `${today}T00:00:00Z`)
      .order('recorded_at', { ascending: false });
    
    if (data) {
      setLogs(data);
      const total = data.reduce((acc, curr) => acc + curr.amount_ml, 0);
      setWaterMl(total);
    }

    // 2. Calcula Meta (Peso * 40ml)
    const currentWeight = parseFloat(localStorage.getItem('craque_weight')) || 45;
    let calcGoal = currentWeight * 40;
    if (calcGoal < 1500) calcGoal = 1500;
    if (calcGoal > 3000) calcGoal = 3000;
    setGoalMl(calcGoal);
    setLoading(false);
  }

  useEffect(() => {
    initData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addWater = async (amount) => {
    const { error } = await supabase
      .from('water_logs')
      .insert([{ user_id: USER_ID, amount_ml: amount }]);

    if (!error) {
      initData();
    }
  };

  const deleteWater = async (id) => {
    if (!confirm('⚽ Apagar esse registro de água?')) return;
    const { error } = await supabase.from('water_logs').delete().eq('id', id);
    if (!error) initData();
  };

  const percentage = Math.min(100, Math.round((waterMl / goalMl) * 100));

  const getMessage = () => {
    if (percentage >= 100) return 'Campo irrigado! Missão cumprida! 🏆';
    if (percentage >= 75) return 'Último quarto! Você está voando! 🚀';
    if (percentage >= 50) return 'Intervalo do jogo! Metade do caminho! ⚽';
    if (percentage >= 25) return 'Aquecimento iniciado! 🌱';
    return 'Vamos começar o treino? Beba água! 💧';
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      
      <div className="card" style={{ textAlign: 'center', position: 'relative' }}>
        <h2 className="title-primary">Hidratação do Campo 💧</h2>
        <p className="subtitle">{getMessage()}</p>

        {loading ? <div className="spinner" style={{ margin: '2rem auto' }}></div> : (
          <div style={{
            width: '100%',
            height: '240px',
            background: '#e0cc9f', // cor de terra
            borderRadius: 'var(--radius-lg)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            border: '8px solid #f8f9fa',
            boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)'
          }}>
            {/* O gramado/água subindo */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${percentage}%`,
              background: 'linear-gradient(to top, #2ecc71, #3498db)',
              transition: 'height 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}>
              {percentage > 0 && <div className="water-wave" />}
            </div>

            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255,255,255,0.9)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              color: '#2980b9',
              boxShadow: 'var(--shadow-sm)',
              zIndex: 10
            }}>
              {percentage}% Irrigado
            </div>
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--water-blue)' }}>{waterMl}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}> / {goalMl} ml</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
          {[150, 250, 500].map(amount => (
            <button 
              key={amount}
              onClick={() => addWater(amount)}
              style={{
                padding: '0.8rem 0',
                borderRadius: 'var(--radius-md)',
                background: 'white',
                border: '2px solid var(--water-blue)',
                color: 'var(--water-blue)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              <Droplets size={14} />
              +{amount}ml
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Irrigações de Hoje</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {logs.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>O campo está seco! Adicione água.</p>}
          {logs.map(log => (
            <div key={log.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.8rem',
              borderRadius: '8px',
              background: '#f8f9fa',
              borderLeft: '4px solid var(--water-blue)'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--water-blue)' }}>+{log.amount_ml}ml</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{format(new Date(log.recorded_at), 'HH:mm')}</span>
                <button onClick={() => deleteWater(log.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
