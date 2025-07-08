-- Create sample table
CREATE TABLE sample (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sample ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON sample
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policy to allow read access for anonymous users
CREATE POLICY "Allow read access for anonymous users" ON sample
    FOR SELECT USING (true);

-- Insert sample data
INSERT INTO sample (name, description) VALUES
    ('サンプル1', 'これは最初のサンプルデータです'),
    ('サンプル2', 'これは二番目のサンプルデータです'),
    ('サンプル3', NULL);
