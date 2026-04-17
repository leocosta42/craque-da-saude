'use client';
import { useState, useEffect } from 'react';
import { User, Calendar, Ruler, Weight, Target, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../components/Layout/Toast';

export default function PerfilPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    startWeight: '',
    goal: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Carrega dados salvos
    const data = {
      name: localStorage.getItem('craque_name') || '',
      age: localStorage.getItem('craque_age') || '',
      height: localStorage.getItem('craque_height') || '',
      startWeight: localStorage.getItem('craque_startWeight') || '',
      goal: localStorage.getItem('craque_goal') || ''
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(data);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('craque_name', formData.name);
    localStorage.setItem('craque_age', formData.age);
    localStorage.setItem('craque_height', formData.height);
    localStorage.setItem('craque_startWeight', formData.startWeight);
    localStorage.setItem('craque_goal', formData.goal);
    showToast('Perfil de Atleta atualizado com sucesso! 🏆', 'success');
  };

  return (
    <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/" style={{ color: 'var(--text-main)' }}><ChevronLeft /></Link>
        <h2 className="title-primary" style={{ margin: 0 }}>Meus Dados de Atleta</h2>
      </div>

      <div className="card">
        <label style={labelStyle}><User size={16} /> Nome do Craque</label>
        <input 
          style={inputStyle}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Neymar Jr."
        />

        <label style={labelStyle}><Calendar size={16} /> Idade</label>
        <input 
          style={inputStyle}
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Ex: 10"
        />

        <label style={labelStyle}><Ruler size={16} /> Altura (cm)</label>
        <input 
          style={inputStyle}
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Ex: 140"
        />

        <label style={labelStyle}><Weight size={16} /> Peso Inicial (kg)</label>
        <input 
          style={inputStyle}
          type="number"
          name="startWeight"
          value={formData.startWeight}
          onChange={handleChange}
          placeholder="Ex: 50.5"
        />

        <label style={labelStyle}><Target size={16} /> Minha Meta Principal</label>
        <textarea 
          style={{ ...inputStyle, height: '80px', resize: 'none' }}
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          placeholder="Ex: Beber mais água e ser titular do time!"
        />

        <button 
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '1.2rem',
            background: 'var(--grad-field)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            marginTop: '1rem',
            cursor: 'pointer'
          }}
        >
          SALVAR ALTERAÇÕES 🏆
        </button>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  marginBottom: '6px',
  marginTop: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '0.9rem',
  borderRadius: '10px',
  border: '2px solid #f0f0f0',
  fontSize: '1rem',
  outline: 'none',
  background: '#fcfcfc'
};
