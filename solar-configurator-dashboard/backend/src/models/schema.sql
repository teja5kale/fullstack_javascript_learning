-- Solar Configurator Web Dashboard — Database Schema
-- Run this against your PostgreSQL database before starting the backend.

CREATE TABLE IF NOT EXISTS projects (
  id               SERIAL PRIMARY KEY,
  name             VARCHAR(150) NOT NULL,
  location         VARCHAR(150),
  capacity_mw      NUMERIC(8,2) NOT NULL CHECK (capacity_mw > 0),
  table_type       VARCHAR(20)  NOT NULL CHECK (table_type IN ('Fixed Tilt', 'Tracker')),
  table_width_m    NUMERIC(6,2) NOT NULL,
  table_length_m   NUMERIC(6,2) NOT NULL,
  pitch1_m         NUMERIC(6,2) NOT NULL,
  pitch2_m         NUMERIC(6,2) NOT NULL,
  boundary_width_m  NUMERIC(8,2) NOT NULL,
  boundary_height_m NUMERIC(8,2) NOT NULL,
  setback_m        NUMERIC(6,2) NOT NULL DEFAULT 3,
  piles_per_table  INTEGER NOT NULL DEFAULT 4,
  status           VARCHAR(20)  NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Review', 'Approved')),
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cable_runs (
  id               SERIAL PRIMARY KEY,
  project_id       INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  cable_type       VARCHAR(20) NOT NULL CHECK (cable_type IN ('LT', 'DC', 'HT')),
  routing          VARCHAR(20) NOT NULL CHECK (routing IN ('Above Ground', 'Underground')),
  avg_length_m     NUMERIC(8,2) NOT NULL,
  count            INTEGER NOT NULL,
  cost_per_meter   NUMERIC(8,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cable_runs_project_id ON cable_runs(project_id);
