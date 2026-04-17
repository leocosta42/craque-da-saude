'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function WeightChart({ data }) {
  // Transforma os dados do Supabase pro formato do Recharts
  const chartData = data.map((item, index) => {
    const prevWeight = index > 0 ? data[index - 1].weight : item.weight;
    const isGain = item.weight > prevWeight;
    
    return {
      name: format(new Date(item.recorded_at), 'dd/MM', { locale: ptBR }),
      peso: item.weight,
      color: isGain ? '#e74c3c' : 'var(--field-green-dark)'
    };
  });

  return (
    <div style={{ width: '100%', height: 220 }}>
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Comece a treinar para ver o gráfico! ⚽</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--field-green)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--field-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" fontSize={11} stroke="var(--text-muted)" axisLine={false} tickLine={false} />
            <YAxis fontSize={11} stroke="var(--text-muted)" axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']}/>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="peso" 
              stroke="var(--field-green-dark)" 
              strokeWidth={3}
              fill="url(#colorPeso)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
