-- Craque da Saúde - Database Schema Final

-- Ativando UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Perfis das Crianças (Centralizador)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_name TEXT NOT NULL DEFAULT 'Jogador',
  birth_date DATE,
  last_weight DECIMAL(5,2),
  height_cm INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Peso 
CREATE TABLE weight_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Alimentação
CREATE TABLE food_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'premium' ou 'desgaste'
  description TEXT, -- Ex: 'Arroz e feijão'
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Água
CREATE TABLE water_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml INT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Adicionando um perfil inicial fixo para o ambiente de testes (Mock)
-- Caso você já tenha o ID de um usuário poderá remover essa linha futuramente.
INSERT INTO profiles (id, child_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Campeão')
ON CONFLICT (id) DO NOTHING;
