'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek,
  isAfter
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame, CalendarDays, Plus } from 'lucide-react';
import { useToast } from '../../components/Layout/Toast';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [retroDay, setRetroDay] = useState(null);
  const [weightInput, setWeightInput] = useState('');
  const { showToast, showConfirm } = useToast();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
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
  }, [currentMonth]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addRetroWeight = async () => {
    const val = parseFloat(weightInput);
    if (!val || val < 10 || val > 200) {
      showToast('Informe um peso válido entre 10kg e 200kg.', 'warning');
      return;
    }

    const recordDate = new Date(retroDay);
    recordDate.setHours(12, 0, 0, 0);

    const { error } = await supabase
      .from('weight_logs')
      .insert([{ 
        user_id: USER_ID, 
        weight: val, 
        recorded_at: recordDate.toISOString() 
      }]);

    if (!error) {
      showToast(`Peso de ${format(retroDay, 'dd/MM')} registrado! 🏆`, 'success');
      setRetroDay(null);
      setWeightInput('');
      fetchLogs();
    } else {
      showToast('Erro ao salvar peso retroativo.', 'error');
    }
  };

  const deleteWeight = (id) => {
    showConfirm('⚽ Apagar esse registro de peso?', async () => {
      const { error } = await supabase.from('weight_logs').delete().eq('id', id);
      if (!error) {
        setSelectedDay(null);
        fetchLogs();
      }
    });
  };

  // Lógica do Calendário
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });

  const logsMap = {};
  weightLogs.forEach((log) => {
    const dateKey = format(new Date(log.recorded_at), 'yyyy-MM-dd');
    logsMap[dateKey] = log;
  });

  const sortedUniqueDays = Object.keys(logsMap).sort().map(day => logsMap[day]);
  sortedUniqueDays.forEach((log, index) => {
    const prevWeight = index > 0 ? sortedUniqueDays[index - 1].weight : log.weight;
    log.color = log.weight > prevWeight ? 'red' : 'green';
  });

  const currentMonthLogs = sortedUniqueDays.filter(l => isSameMonth(new Date(l.recorded_at), currentMonth));
  const stats = {
    total: currentMonthLogs.length,
    green: currentMonthLogs.filter(l => l.color === 'green').length,
    red: currentMonthLogs.filter(l => l.color === 'red').length,
    streak: currentMonthLogs.length,
  };

  const isFutureLimit = isAfter(addMonths(startOfMonth(currentMonth), 1), new Date());

  return (
    <div style={{ padding: '0 1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>
      
      {/* Navegação de Meses */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ color: 'var(--field-green-dark)' }}>
          <ChevronLeft size={28} />
        </button>
        <h2 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button 
          onClick={() => !isFutureLimit && setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ color: isFutureLimit ? '#ccc' : 'var(--field-green-dark)', cursor: isFutureLimit ? 'not-allowed' : 'pointer' }}
          disabled={isFutureLimit}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Grid Calendário */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: '0.5rem' }}>{d}</div>
          ))}

          {calendarDays.map((day, idx) => {
            const dStr = format(day, 'yyyy-MM-dd');
            const log = logsMap[dStr];
            const isCurrMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isSameDay(day, new Date());
            const isPast = !isAfter(day, new Date());

            let bg = isCurrMonth ? '#fff' : '#f8f9fa';
            let color = isCurrMonth ? 'var(--text-main)' : '#a0a0a0';
            let border = isCurrMonth ? '1px solid #eee' : 'none';

            if (log && isCurrMonth) {
              bg = log.color === 'green' ? 'var(--field-green)' : '#ff7675';
              color = '#fff';
              border = 'none';
            }
            if (isTodayDate) border = '2px solid var(--field-green-dark)';

            return (
              <div 
                key={idx}
                onClick={() => {
                  if (log) setSelectedDay(log);
                  else if (isPast && isCurrMonth) setRetroDay(day);
                }}
                style={{
                  aspectRatio: '1', borderRadius: '10px', background: bg, color: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', fontWeight: 800, border, opacity: isCurrMonth ? 1 : 0.3,
                  cursor: (log || (isPast && isCurrMonth)) ? 'pointer' : 'default', transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {format(day, 'd')}
                {log && <div style={{ position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: '50%', background: 'white' }} />}
                {!log && isPast && isCurrMonth && <div style={{ position: 'absolute', bottom: 2, right: 2, opacity: 0.3 }}><Plus size={10} /></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Retroativo */}
      {retroDay && (
        <div className="confirm-overlay" onClick={() => setRetroDay(null)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
            <h3 className="title-primary">Peso Retroativo 📅</h3>
            <p className="subtitle">Data: {format(retroDay, 'dd/MM/yyyy')}</p>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <input 
                autoFocus type="number" step="0.1" value={weightInput}
                onChange={e => setWeightInput(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '2px solid #ddd', fontSize: '1.5rem', textAlign: 'center', fontWeight: 800 }}
                placeholder="0.0"
              />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>kg</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setRetroDay(null)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#f0f0f0', fontWeight: 700 }}>Voltar</button>
              <button onClick={addRetroWeight} className="btn-pulse" style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--grad-field)', color: 'white', fontWeight: 800 }}>SALVAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Detalhes */}
      {selectedDay && (
        <div className="card" style={{ background: 'var(--text-main)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{format(new Date(selectedDay.recorded_at), 'dd/MM/yyyy')}:</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedDay.weight} kg</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => deleteWeight(selectedDay.id)} style={{ background: '#e74c3c', color: 'white', borderRadius: '8px', padding: '8px' }}>
              <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <button onClick={() => setSelectedDay(null)} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', padding: '10px 15px', fontWeight: 700 }}>OK</button>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="card" style={{ background: 'var(--grad-surface)' }}>
        <h3 className="title-primary" style={{ fontSize: '1.1rem' }}>Resumo Mensal 📊</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <StatBox icon={<CalendarDays size={18}/>} label="DIAS REGISTRADOS" val={stats.total} />
          <StatBox icon={<Flame color="#e67e22" size={18}/>} label="SEQUÊNCIA" val={stats.streak} />
          <StatBox icon="🟢" label="VITÓRIAS" val={stats.green} color="var(--field-green-dark)" />
          <StatBox icon="🔴" label="GANHOS" val={stats.red} color="#e74c3c" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, val, color }) {
  return (
    <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '12px', textAlign: 'center' }}>
      <div style={{ marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, color }}>{val}</div>
      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>{label}</div>
    </div>
  );
}
