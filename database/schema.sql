-- TankTrack's first PostgreSQL design.
-- This is not connected to the browser prototype yet. It is the contract for
-- the next milestone, when a Node.js API takes ownership of the data.

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tanks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  volume NUMERIC(6, 2) NOT NULL CHECK (volume > 0),
  volume_unit TEXT NOT NULL CHECK (volume_unit IN ('g', 'L')),
  residents TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE water_tests (
  id UUID PRIMARY KEY,
  tank_id UUID NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
  tested_on DATE NOT NULL,
  ph NUMERIC(3, 1) CHECK (ph BETWEEN 0 AND 14),
  gh INTEGER CHECK (gh >= 0),
  kh INTEGER CHECK (kh >= 0),
  nitrate_ppm NUMERIC(6, 2) CHECK (nitrate_ppm >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE maintenance_tasks (
  id UUID PRIMARY KEY,
  tank_id UUID REFERENCES tanks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'water_change', 'liquid_fertilizer', 'root_tabs', 'sludge_bacteria',
    'liquid_carbon', 'filter_cleaning', 'other'
  )),
  recurrence_days INTEGER CHECK (recurrence_days > 0),
  due_on DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- These are the queries the dashboard will need most often.
CREATE INDEX water_tests_tank_date_idx ON water_tests (tank_id, tested_on DESC);
CREATE INDEX maintenance_tasks_user_due_idx ON maintenance_tasks (user_id, due_on)
  WHERE completed_at IS NULL;
