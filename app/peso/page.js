'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import WeightChart from '../../components/Weight/WeightChart';
import MotivationalCard from '../../components/Weight/MotivationalCard';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useToast } from '../../components/Layout/Toast';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function PesoPage() {
  const [weight, setWeight] = useState('');
  const [showGoal, setShowGoal] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast, showConfirm } = useToast();

  async function fetchHistory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .order('recorded_at', { ascending: true });
    
    if (data) {
      // INTELIGENCIA: Agrupa por dia e pega o ULTIMO registro de cada dia
      const grouped = {};
      data.forEach(log => {
        const dayStr = format(new Date(log.recorded_at), 'yyyy-MM-dd');
        grouped[dayStr] = log; // Sobrescreve, mantendo sempre o último do dia
      });
      
      const uniqueDays = Object.values(grouped).slice(-30); // Pega os últimos 30 dias únicos
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistory(uniqueDays);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistory();
  }, []);

  const handleSave = async () => {
    const val = parseFloat(weight);
    if (!val || val < 10 || val > 200) {
      showToast('Informe um peso válido entre 10kg e 200kg.', 'warning');
      return;
    }

    setIsSaving(true);
    const { error } = await supabase
      .from('weight_logs')
      .insert([{ user_id: USER_ID, weight: val }]);

    if (!error) {
      setShowGoal(true);
      localStorage.setItem('craque_weight', val);
      setWeight('');
      await fetchHistory();
      setTimeout(() => setShowGoal(false), 3000);
    } else {
      showToast('Tivemos um problema no gramado! Tente novamente.', 'error');
    }
    setIsSaving(false);
  };

  const deleteWeight = (id) => {
    showConfirm('Apagar esse registro de peso?', async () => {
      const { error } = await supabase.from('weight_logs').delete().eq('id', id);
      if (!error) fetchHistory();
    });
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      {showGoal && <div className="goal-animation">⚽ GOL!! Peso Registrado!</div>}
      
      <MotivationalCard />

      <div className="card">
        <h2 className="title-primary">Registrar Treino ⚽</h2>
        <p className="subtitle">Seu peso de hoje para a academia do craque.</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="number"
              step="0.1"
              placeholder="Ex: 45.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                paddingRight: '3rem',
                borderRadius: '12px',
                border: '2px solid var(--neutral-gray)',
                fontSize: '1.2rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>kg</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={!isSaving ? 'btn-pulse' : ''}
            style={{
              background: 'var(--grad-field)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0 1.5rem',
              fontWeight: '700',
              fontSize: '1.1rem',
              boxShadow: '0 4px 10px rgba(46, 204, 113, 0.1)',
              minWidth: '100px'
            }}
          >
            {isSaving ? <span className="btn-spinner"></span> : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Evolução do Craque</h2>
        <p className="subtitle">Verde = Em forma | Vermelho = Ganho natural</p>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><div className="spinner"></div></div>
        ) : (
          <WeightChart data={history} />
        )}
      </div>

      <div className="card">
        <h2 className="title-primary">Últimas Pesagens</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {history.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum dado no radar.</p>}
          {history.slice(-5).reverse().map(log => (
            <div key={log.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.8rem',
              borderRadius: '8px',
              background: '#f8f9fa',
              borderLeft: `4px solid ${log.color === 'green' ? 'var(--field-green)' : '#e74c3c'}`
            }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{log.weight} kg</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{format(new Date(log.recorded_at), 'dd/MM')}</span>
                <button onClick={() => deleteWeight(log.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
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
