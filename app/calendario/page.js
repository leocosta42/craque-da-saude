'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek,
  isAfter, isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame, Trophy, Info, CalendarDays } from 'lucide-react';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  async function fetchLogs() {
    setLoading(true);
    // Buscamos um intervalo maior para ter o peso do último dia do mês anterior para comparação
    const startFetch = startOfMonth(subMonths(currentMonth, 1)).toISOString();
    const endFetch = endOfMonth(currentMonth).toISOString();

    const { data } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', USER_ID)
      .gte('recorded_at', startFetch)
      .lte('recorded_at', endFetch)
      .order('recorded_at', { ascending: true });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (data) setWeightLogs(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  // Grade de dias (D S T Q Q S S)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Mapeamento de logs para acesso rápido e lógica de cores
  const logsMap = {};
  const uniqueDaysList = [];
  
  weightLogs.forEach((log) => {
    const dateKey = format(new Date(log.recorded_at), 'yyyy-MM-dd');
    
    // Se o dia já tem registro, o novo (mais recente por causa do order ascending) substitui 
    // mas a lógica de cor precisa ser baseada no dia ANTERIOR de fato.
    
    // Vamos reconstruir a lógica comparativa baseada apenas no último peso de cada dia
    logsMap[dateKey] = log;
  });

  const sortedUniqueDays = Object.keys(logsMap).sort().map(day => logsMap[day]);

  sortedUniqueDays.forEach((log, index) => {
    const prevWeight = index > 0 ? sortedUniqueDays[index - 1].weight : log.weight;
    log.color = log.weight > prevWeight ? 'red' : 'green';
    
    if (isSameMonth(new Date(log.recorded_at), currentMonth)) {
      if (log.weight > prevWeight) gainDays++; else lossDays++;
    }
  });

  // Cálculos de Resumo (apenas para o mês atual visível)
  const currentMonthUniqueLogs = sortedUniqueDays.filter(l => isSameMonth(new Date(l.recorded_at), currentMonth));
  const stats = {
    total: currentMonthUniqueLogs.length,
    green: currentMonthUniqueLogs.filter(l => l.color === 'green').length,
    red: currentMonthUniqueLogs.filter(l => l.color === 'red').length,
    streak: currentMonthUniqueLogs.length, // Simplificado para dias com log no mês
  };

  // Cálculo Simples de Sequência (Dias seguidos com registro)
  let tempStreak = 0;
  // Ordenamos todos os logs para ver a sequência global
  const allDates = weightLogs.map(l => format(new Date(l.recorded_at), 'yyyy-MM-dd'));
  // (Simplificado para fins de UI lúdica)
  stats.streak = currentMonthLogs.length; 

  const isFuture = isAfter(addMonths(startOfMonth(currentMonth), 1), new Date());

  return (
    <div style={{ padding: '0 1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      
      {/* Header Navegação */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{ background: 'none', border: 'none', color: 'var(--field-green-dark)' }}
        >
          <ChevronLeft size={28} />
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h2>
        </div>

        <button 
          onClick={() => !isFuture && setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ 
            background: 'none', border: 'none', 
            color: isFuture ? '#ccc' : 'var(--field-green-dark)',
            cursor: isFuture ? 'not-allowed' : 'pointer'
          }}
          disabled={isFuture}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Grade do Calendário */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: '0.5rem' }}>
              {d}
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const log = logsMap[dStr];
            const isCurrMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isSameDay(day, new Date());

            let bg = '#f8f9fa';
            let color = '#a0a0a0';
            let border = 'none';

            if (isCurrMonth) {
              color = 'var(--text-main)';
              bg = '#fff';
              border = '1px solid #eee';
              
              if (log) {
                bg = log.color === 'green' ? 'var(--field-green)' : '#ff7675';
                color = '#fff';
                border = 'none';
              }
            }

            if (isTodayDate) {
              border = '2px solid var(--field-green-dark)';
            }

            return (
              <div 
                key={idx}
                onClick={() => log && setSelectedDay(log)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '10px',
                  background: bg,
                  color: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: log ? 'pointer' : 'default',
                  border,
                  opacity: isCurrMonth ? 1 : 0.3,
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {format(day, 'd')}
                {log && (
                  <div style={{ position: 'absolute', top: 2, right: 2 }}>
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'white' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip de Seleção */}
      {selectedDay && (
        <div className="card" style={{ 
          background: 'var(--text-main)', color: 'white', display: 'flex', 
          justifyContent: 'space-between', alignItems: 'center', animation: 'slide-down 0.3s' 
        }}>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Peso em {format(new Date(selectedDay.recorded_at), 'dd/MM')}:</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedDay.weight} kg</div>
          </div>
          <button onClick={() => setSelectedDay(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: 30, height: 30 }}>✕</button>
        </div>
      )}

      {/* Resumo Estatístico */}
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h3 className="title-primary" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Resumo da Temporada 📊</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <CalendarDays size={20} color="var(--field-green-dark)" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.total}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>DIAS REGISTRADOS</div>
          </div>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <Flame size={20} color="#e67e22" style={{ marginBottom: '4px' }} />
            <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stats.streak}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>SEQUÊNCIA ATUAL</div>
          </div>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🟢</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--field-green-dark)' }}>{stats.green}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>VITÓRIAS (PERDA)</div>
          </div>
          <div style={{ background: '#fff', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🔴</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e74c3c' }}>{stats.red}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>GANHOS (ESTIRÃO)</div>
          </div>
        </div>
      </div>

    </div>
  );
}
