'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Dumbbell, Clock, Timer, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../components/Layout/Toast';

const USER_ID = '00000000-0000-0000-0000-000000000000';

const SPORTS = [
  { id: 'futebol', name: 'Treino de Futebol', icon: '⚽' },
  { id: 'tenis', name: 'Tênis de Mesa', icon: '🏓' },
  { id: 'caminhada', name: 'Caminhada', icon: '🚶' },
  { id: 'natacao', name: 'Natação', icon: '🏊' },
  { id: 'bike', name: 'Andar de Bicicleta', icon: '🚲' },
];

export default function EsportesPage() {
  const [logs, setLogs] = useState([]);
  const [selectedSport, setSelectedSport] = useState('futebol');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast, showConfirm } = useToast();

  async function fetchSportsLogs() {
    setLoading(true);
    const { data } = await supabase
      .from('sports_logs')
      .select('*')
      .eq('user_id', USER_ID)
      .order('recorded_at', { ascending: false })
      .limit(10);
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setLogs(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSportsLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSportLog = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('sports_logs')
      .insert([{ 
        user_id: USER_ID, 
        sport_type: selectedSport, 
        duration_minutes: parseInt(duration) 
      }]);

    if (!error) {
      showToast('🏆 Treino concluído! Pontos de experiência adicionados!', 'success');
      await fetchSportsLogs();
    }
    setIsSaving(false);
  };

  const deleteSportLog = (id) => {
    showConfirm('Deseja mesmo apagar esse treino?', async () => {
      const { error } = await supabase
        .from('sports_logs')
        .delete()
        .eq('id', id);
      if (!error) fetchSportsLogs();
    });
  };

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h2 className="title-primary">Novo Treinamento 🏋️‍♂️</h2>
        <p className="subtitle">Registre sua atividade do dia.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Qual foi o Esporte?</label>
            <select 
              value={selectedSport} 
              onChange={(e) => setSelectedSport(e.target.value)}
              style={inputStyle}
            >
              {SPORTS.map(s => (
                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Duração (minutos)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['15', '30', '60', '90'].map(min => (
                <button 
                  key={min}
                  onClick={() => setDuration(min)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: duration === min ? '2px solid var(--field-green-dark)' : '1px solid #ddd',
                    background: duration === min ? 'rgba(46, 204, 113, 0.1)' : 'white',
                    fontWeight: 700,
                    color: duration === min ? 'var(--field-green-dark)' : 'var(--text-muted)'
                  }}
                >
                  {min}
                </button>
              ))}
              <input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{ ...inputStyle, width: '70px', padding: '0.4rem' }}
              />
            </div>
          </div>

          <button 
            onClick={addSportLog}
            disabled={isSaving}
            className={!isSaving ? 'btn-pulse' : ''}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--grad-field)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '0.5rem',
              height: '54px'
            }}
          >
            {isSaving ? <span className="btn-spinner"></span> : <><Plus size={20} /> REGISTRAR TREINO</>}
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="title-primary">Histórico de Treinos</h2>
        {loading ? <div className="spinner" style={{ margin: '1rem auto' }}></div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {logs.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum treino registrado ainda. Bora se mexer!</p>}
            {logs.map(log => {
              const sport = SPORTS.find(s => s.id === log.sport_type) || { icon: '🏅', name: log.sport_type };
              return (
                <div key={log.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: '#f8f9fa',
                  borderLeft: '4px solid var(--field-green-dark)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{sport.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{sport.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Timer size={10} /> {log.duration_minutes} minutos
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {format(new Date(log.recorded_at), 'dd/MM')}
                    </div>
                    <button 
                      onClick={() => deleteSportLog(log.id)}
                      style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '5px',
  display: 'block'
};

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.95rem',
  background: 'white'
};
