'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Scale, Droplets, Dumbbell, Flame, TrendingDown, TrendingUp, ChevronRight } from 'lucide-react';
import { format, differenceInCalendarDays } from 'date-fns';
import Link from 'next/link';

const USER_ID = '00000000-0000-0000-0000-000000000000';

export default function Home() {
  const [data, setData] = useState({
    currentWeight: null,
    weightDiff: null,
    waterToday: 0,
    waterGoal: 2000,
    lastSport: null,
    streak: 0,
    mealsToday: 0,
    premiumMeals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('Campeão');

  async function loadDashboard() {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    // Parallel fetches
    const [weightRes, waterRes, sportRes, foodRes] = await Promise.all([
      supabase.from('weight_logs').select('*').eq('user_id', USER_ID).order('recorded_at', { ascending: false }).limit(10),
      supabase.from('water_logs').select('*').eq('user_id', USER_ID).gte('recorded_at', `${today}T00:00:00Z`),
      supabase.from('sports_logs').select('*').eq('user_id', USER_ID).order('recorded_at', { ascending: false }).limit(1),
      supabase.from('food_logs').select('*').eq('user_id', USER_ID).gte('recorded_at', `${today}T00:00:00Z`),
    ]);

    // Weight
    let currentWeight = null;
    let weightDiff = null;
    if (weightRes.data && weightRes.data.length > 0) {
      // Aggregate by day
      const grouped = {};
      weightRes.data.forEach(log => {
        const d = format(new Date(log.recorded_at), 'yyyy-MM-dd');
        if (!grouped[d]) grouped[d] = log;
      });
      const sorted = Object.values(grouped).sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at));
      currentWeight = sorted[0]?.weight;
      if (sorted.length >= 2) {
        weightDiff = (sorted[0].weight - sorted[1].weight).toFixed(1);
      }
    }

    // Water
    const waterToday = waterRes.data ? waterRes.data.reduce((acc, c) => acc + c.amount_ml, 0) : 0;
    const savedWeight = parseFloat(localStorage.getItem('craque_weight')) || 45;
    let waterGoal = savedWeight * 40;
    if (waterGoal < 1500) waterGoal = 1500;
    if (waterGoal > 3000) waterGoal = 3000;

    // Sport
    const lastSport = sportRes.data?.[0] || null;

    // Food
    const mealsToday = foodRes.data?.length || 0;
    const premiumMeals = foodRes.data?.filter(f => f.type === 'premium').length || 0;

    // Streak (days with weight log)
    let streak = 0;
    if (weightRes.data && weightRes.data.length > 0) {
      const allDays = [...new Set(weightRes.data.map(l => format(new Date(l.recorded_at), 'yyyy-MM-dd')))].sort().reverse();
      for (let i = 0; i < allDays.length; i++) {
        const expectedDay = new Date();
        expectedDay.setDate(expectedDay.getDate() - i);
        const expected = format(expectedDay, 'yyyy-MM-dd');
        if (allDays.includes(expected)) {
          streak++;
        } else {
          break;
        }
      }
    }

    const savedName = localStorage.getItem('craque_name');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedName) setName(savedName);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({ currentWeight, weightDiff, waterToday, waterGoal, lastSport, streak, mealsToday, premiumMeals });
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waterPct = Math.min(100, Math.round((data.waterToday / data.waterGoal) * 100));

  const SPORT_NAMES = {
    futebol: '⚽ Futebol',
    tenis: '🏓 Tênis de Mesa',
    caminhada: '🚶 Caminhada',
    natacao: '🏊 Natação',
    bike: '🚲 Bicicleta',
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="content-area" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Painel do Craque 🏟️
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
          Resumo do dia do {name}
        </p>
      </div>

      {/* Streak Banner */}
      {data.streak > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f39c12, #e67e22)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.2rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 15px rgba(243, 156, 18, 0.3)',
        }}>
          <Flame size={28} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{data.streak} {data.streak === 1 ? 'dia' : 'dias'} seguidos!</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Sequência de registros de peso</div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>

        {/* Weight Card */}
        <Link href="/peso" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(46, 204, 113, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Scale size={18} color="var(--field-green-dark)" />
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
            <div style={{ marginTop: '0.8rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {data.currentWeight ? `${data.currentWeight}` : '—'}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}> kg</span>
              </div>
              {data.weightDiff !== null && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                  fontSize: '0.7rem', fontWeight: 700, marginTop: '4px', padding: '2px 6px', borderRadius: '6px',
                  background: parseFloat(data.weightDiff) <= 0 ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                  color: parseFloat(data.weightDiff) <= 0 ? 'var(--field-green-dark)' : '#e74c3c',
                }}>
                  {parseFloat(data.weightDiff) <= 0 ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                  {data.weightDiff > 0 ? '+' : ''}{data.weightDiff} kg
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Peso Atual</div>
          </div>
        </Link>

        {/* Water Card */}
        <Link href="/agua" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(52, 152, 219, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Droplets size={18} color="var(--water-blue)" />
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
            <div style={{ marginTop: '0.8rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {waterPct}<span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>%</span>
              </div>
              {/* Mini progress bar */}
              <div style={{
                width: '100%', height: '6px', borderRadius: '3px',
                background: '#eee', marginTop: '6px', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${waterPct}%`, height: '100%', borderRadius: '3px',
                  background: 'var(--grad-water)',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '6px' }}>
              {data.waterToday}ml / {data.waterGoal}ml
            </div>
          </div>
        </Link>

        {/* Food Card */}
        <Link href="/alimentacao" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(46, 204, 113, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>
                🥗
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
            <div style={{ marginTop: '0.8rem' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {data.mealsToday}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}> ref.</span>
              </div>
              {data.mealsToday > 0 && (
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, marginTop: '4px', padding: '2px 6px', borderRadius: '6px',
                  background: 'rgba(46,204,113,0.1)', color: 'var(--field-green-dark)', display: 'inline-block',
                }}>
                  {data.premiumMeals} premium
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Refeições Hoje</div>
          </div>
        </Link>

        {/* Sports Card */}
        <Link href="/esportes" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'rgba(155, 89, 182, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Dumbbell size={18} color="#8e44ad" />
              </div>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
            <div style={{ marginTop: '0.8rem' }}>
              {data.lastSport ? (
                <>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {SPORT_NAMES[data.lastSport.sport_type] || data.lastSport.sport_type}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
                    {data.lastSport.duration_minutes}min — {format(new Date(data.lastSport.recorded_at), 'dd/MM')}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>
                  Nenhum treino
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Último Treino</div>
          </div>
        </Link>
      </div>

      {/* Quick Tip */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--field-green), var(--field-green-dark))',
        color: 'white', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
        <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '4px' }}>Dica do Técnico</div>
        <p style={{ fontSize: '0.8rem', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
          {waterPct < 50
            ? 'Hidrate o campo! Você ainda não bebeu metade da sua meta de água hoje. 💧'
            : data.mealsToday === 0
            ? 'Ainda sem refeições registradas hoje. Combustível premium faz o craque voar! 🥗'
            : data.streak >= 3
            ? `Incrível! ${data.streak} dias seguidos registrando peso. Você é disciplinado como um titular! ⭐`
            : 'Registre seu peso todos os dias para manter sua sequência de craque! 🔥'
          }
        </p>
      </div>

    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem' }}>
      <div style={{ height: '40px', width: '60%', borderRadius: '8px', marginBottom: '0.5rem' }} className="skeleton-pulse"></div>
      <div style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} className="skeleton-pulse"></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} className="skeleton-pulse"></div>
        ))}
      </div>
      <div style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} className="skeleton-pulse"></div>
    </div>
  );
}
