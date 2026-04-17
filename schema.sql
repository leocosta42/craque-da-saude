-- Craque da Saúde - Database Schema

-- Ativando UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Perfis das Crianças
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  start_weight_kg DECIMAL(5,2),
  height_cm INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Peso 
CREATE TABLE weight_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Alimentação
CREATE TABLE food_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL, -- Ex: 'café da manhã', 'almoço', 'lanche', 'jantar'
  is_healthy BOOLEAN NOT NULL DEFAULT true, -- Lúdico: True = Combustível, False = Alimento de Desgaste
  notes TEXT,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Registro de Água
CREATE TABLE water_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml INT NOT NULL,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Opcional: RLS Policies, caso a aplicação vá para produção e demande separação rigorosa de acesso por id do usuário.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can query their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can edit their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas similares podem ser aplicadas as log tables.
