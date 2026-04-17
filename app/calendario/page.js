'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame, Trophy, CalendarDays } from 'lucide-react';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [currentMonth]);

  async function fetchLogs() {
    setLoading(true);
    const start = startOfMonth(currentMonth).toISOString();
    const end = endOfMonth(currentMonth).toISOString();

    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', USER_ID)
      .gte('recorded_at', start)
      .lte('recorded_at', end)
      .order('recorded_at', { ascending: true });
    
    if (data) setWeightLogs(data);
    setLoading(false);
  }

  // Gera dias do calendário
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 }),
  });

  // Lógica de Cores e Stats
  let lossDays = 0;
  let gainDays = 0;
  let streak = 0;
  let maxStreak = 0;

  const logsByDay = {};
  weightLogs.forEach((log, idx) => {
    const dStr = format(new Date(log.recorded_at), 'yyyy-MM-dd');
    const weight = parseFloat(log.weight);
    
    // Calcula cor baseada no dia anterior informado no banco (independente de ser log seguido)
    const prevWeight = idx > 0 ? parseFloat(weightLogs[idx-1].weight) : weight;
    const color = weight > prevWeight ? 'red' : 'green';
    
    if (weight > prevWeight) gainDays++; else lossDays++;
    
    logsByDay[dStr] = { weight, color };
  });

  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header com Navegação */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft /></button>
        <h2 style={{ textTransform: 'capitalize', fontWeight: 700 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight /></button>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', paddingBottom: '0.5rem' }}>{d}</div>
          ))}
          
          {daysInMonth.map((day, i) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const log = logsByDay[dStr];
            const isCurrent = isSameMonth(day, currentMonth);
            
            let bg = isCurrent ? '#f1f2f6' : '#f9f9f9';
            let color = isCurrent ? 'var(--text-main)' : '#ccc';
            let dot = null;

            if (log) {
              bg = log.color === 'green' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)';
              color = log.color === 'green' ? 'var(--field-green-dark)' : '#e74c3c';
              dot = log.color;
            }

            return (
              <div key={i} style={{
                aspectRatio: '1',
                borderRadius: '12px',
                background: bg,
                color: color,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 700,
                position: 'relative',
                border: isSameDay(day, new Date()) ? '2px solid var(--field-green)' : 'none'
              }}>
                {format(day, 'd')}
                {dot && (
                  <div style={{ 
                    position: 'absolute', bottom: '4px', width: '4px', height: '4px', 
                    borderRadius: '50%', background: dot === 'green' ? 'var(--field-green)' : '#e74c3c' 
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo */}
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h3 className="title-primary" style={{ fontSize: '1.1rem' }}>Resumo da Temporada</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>⚽</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{weightLogs.length}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DIAS JOGADOS</div>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.5rem' }}>🌱</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--field-green-dark)' }}>{lossDays}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VITÓRIAS (PERDA)</div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame color="#e67e22" size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sequência: <span style={{ color: '#e67e22' }}>{weightLogs.length} dias</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy color="var(--gold-trophy)" size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Ganho: <span style={{ color: '#e74c3c' }}>{gainDays} dias</span></span>
          </div>
        </div>
      </div>

    </div>
  );
}
