'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { data: '01/04', peso: 46.5 },
  { data: '05/04', peso: 46.2 },
  { data: '10/04', peso: 45.9 },
  { data: '15/04', peso: 46.1 }, // Um ganho natural (estirão)
  { data: '20/04', peso: 45.5 },
];

export default function WeightChart() {
  return (
    <div style={{ width: '100%', height: 200 }}>
      {/* Fallback caso falhe carregar o recharts (ssr) mas estamos 'use client' entāo tá ok */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--field-green)" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="var(--field-green)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="data" fontSize={12} stroke="var(--text-muted)" axisLine={false} tickLine={false} />
          <YAxis fontSize={12} stroke="var(--text-muted)" axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']}/>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
            labelStyle={{ fontWeight: 'bold', color: 'var(--text-main)' }}
            itemStyle={{ color: 'var(--field-green-dark)' }}
          />
          <Area 
            type="monotone" 
            dataKey="peso" 
            stroke="var(--field-green-dark)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPeso)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
