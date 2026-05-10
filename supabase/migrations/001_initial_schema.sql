-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(50) NOT NULL,
  diagnosis TEXT NOT NULL,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  medical_history TEXT,
  medications TEXT,
  last_visit_date DATE,
  start_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient records table
CREATE TABLE IF NOT EXISTS patient_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  session_id VARCHAR(100),
  standard_evaluations JSONB DEFAULT '{}'::jsonb,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom evaluations table
CREATE TABLE IF NOT EXISTS custom_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_record_id UUID NOT NULL REFERENCES patient_records(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  value TEXT NOT NULL,
  unit VARCHAR(50) NOT NULL,
  direction VARCHAR(50) NOT NULL CHECK (direction IN ('higher_is_better', 'lower_is_better')),
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  tags TEXT[],
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_code ON patients(code);
CREATE INDEX idx_patient_records_patient_id ON patient_records(patient_id);
CREATE INDEX idx_patient_records_user_id ON patient_records(user_id);
CREATE INDEX idx_patient_records_date ON patient_records(date DESC);
CREATE INDEX idx_custom_evaluations_record_id ON custom_evaluations(patient_record_id);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_evaluations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients table
CREATE POLICY "Users can view their own patients"
  ON patients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patients"
  ON patients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patients"
  ON patients FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patients"
  ON patients FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for patient_records table
CREATE POLICY "Users can view records of their patients"
  ON patient_records FOR SELECT
  USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can insert records for their patients"
  ON patient_records FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = patient_records.patient_id
      AND patients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update records of their patients"
  ON patient_records FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete records of their patients"
  ON patient_records FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for custom_evaluations table
CREATE POLICY "Users can view custom evaluations of their records"
  ON custom_evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM patient_records
      WHERE patient_records.id = custom_evaluations.patient_record_id
      AND patient_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert custom evaluations for their records"
  ON custom_evaluations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM patient_records
      WHERE patient_records.id = custom_evaluations.patient_record_id
      AND patient_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update custom evaluations of their records"
  ON custom_evaluations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM patient_records
      WHERE patient_records.id = custom_evaluations.patient_record_id
      AND patient_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete custom evaluations of their records"
  ON custom_evaluations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM patient_records
      WHERE patient_records.id = custom_evaluations.patient_record_id
      AND patient_records.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_records_updated_at
  BEFORE UPDATE ON patient_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
