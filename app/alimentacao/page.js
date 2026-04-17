'use client';
import { Apple, Pizza, Check, X, Trophy, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { useToast } from '../../components/Layout/Toast';

const USER_ID = '00000000-0000-0000-0000-000000000000';

const STICKERS = [
  { id: 1, name: 'Cristiano Cenoura', icon: '🥕' },
  { id: 2, name: 'Messi Maçã', icon: '🍎' },
  { id: 3, name: 'Pelé Pêra', icon: '🍐' },
  { id: 4, name: 'Marta Morango', icon: '🍓' },
  { id: 5, name: 'Mbappé Melancia', icon: '🍉' },
  { id: 6, name: 'Ronaldinho Rabanete', icon: '🥬' },
  { id: 7, name: 'Casemiro Couve', icon: '🥦' },
  { id: 8, name: 'Neymar Nozes', icon: '🥜' },
];

export default function AlimentacaoPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, showConfirm } = useToast();

  async function fetchLogs() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', USER_ID)
      .gte('recorded_at', `${today}T00:00:00Z`)
      .order('recorded_at', { ascending: false });
    
    if (data) setLogs(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logMeal = async (type) => {
    const { error } = await supabase
      .from('food_logs')
      .insert([{ user_id: USER_ID, type }]);

    if (!error) {
      showToast(type === 'premium' ? '🏆 Golaço! Combustível Premium!' : '⚽ Foco no treino! Menos desgaste na próxima!', type === 'premium' ? 'success' : 'warning');
      fetchLogs();
    }
  };

  const deleteMeal = (id) => {
    showConfirm('Apagar essa refeição do histórico?', async () => {
      const { error } = await supabase.from('food_logs').delete().eq('id', id);
      if (!error) fetchLogs();
    });
  };

  const healthyCount = logs.filter(l => l.type === 'premium').length;
  // Desbloqueia 1 figurinha a cada 1 refeição saudável (exemplo para teste rápido)
  const unlockedCount = Math.min(STICKERS.length, healthyCount);

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h2 className="title-primary">Registro de Combustível 🥗</h2>
        <p className="subtitle">Escolha o seu nível de energia para o jogo:</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <button 
            onClick={() => logMeal('premium')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(46, 204, 113, 0.1)',
              border: '2px solid var(--field-green)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--field-green-dark)'
            }}
          >
            <Apple size={32} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}> PREMIUM</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Frutas, Arroz, Feijão, Frango, Ovos
            </span>
          </button>
          
          <button 
            onClick={() => logMeal('desgaste')}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(231, 76, 60, 0.1)',
              border: '2px solid rgba(231, 76, 60, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#c0392b'
            }}
          >
            <Pizza size={32} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}> DESGASTE</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Salgadinho, Refri, Doces, Fast Food
            </span>
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Registros de Hoje</h2>
        {loading ? <div className="spinner" style={{ margin: '1rem auto' }}></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {logs.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum registro hoje. Comece a jogar!</p>}
            {logs.map(log => (
              <div key={log.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.8rem',
                borderRadius: '8px',
                background: log.type === 'premium' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.05)',
                borderLeft: `4px solid ${log.type === 'premium' ? 'var(--field-green)' : '#e74c3c'}`
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {log.type === 'premium' ? '🥗 Combustível Premium' : '🍕 Alimento de Desgaste'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {format(new Date(log.recorded_at), 'HH:mm')}
                  </span>
                  <button onClick={() => deleteMeal(log.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="title-primary" style={{ margin: 0 }}>Álbum do Craque</h2>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold-trophy)' }}>
            {unlockedCount}/8 <Trophy size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
          {STICKERS.map((s, i) => (
            <div key={s.id} style={{
              aspectRatio: '0.8',
              borderRadius: '8px',
              background: i < unlockedCount ? 'var(--grad-field)' : '#f8f9fa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px',
              border: i < unlockedCount ? 'none' : '2px dashed #dee2e6',
              filter: i < unlockedCount ? 'none' : 'grayscale(1)',
              opacity: i < unlockedCount ? 1 : 0.6,
              transition: 'all 0.4s ease'
            }}>
              <span style={{ fontSize: i < unlockedCount ? '1.5rem' : '1rem' }}>{i < unlockedCount ? s.icon : '?'}</span>
              <span style={{ fontSize: '0.5rem', textAlign: 'center', fontWeight: 700, lineHeight: 1, color: i < unlockedCount ? 'white' : 'var(--text-muted)' }}>
                {i < unlockedCount ? s.name.split(' ')[1] : 'Bloqueado'}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
          Ganhe 1 figurinha para cada refeição saudável do dia! ⚽
        </p>
      </div>

    </div>
  );
}
